const core = require("@actions/core")
const exec = require('@actions/exec');
const tc = require("@actions/tool-cache")
const path = require("path")

const base = "https://github.com/xensik/gsc-tool/releases/download/"

// releases before 1.5.0 name x64 assets "x64", 1.5.0+ name them "amd64".
// try the new name first and fall back, instead of parsing versions.
async function download(urls) {
    for (const [i, url] of urls.entries()) {
        try {
            return await tc.downloadTool(url)
        } catch (err) {
            if (i == urls.length - 1) throw err
        }
    }
}

async function main() {
    const version = core.getInput('version', { required: true })
    const user_path = core.getInput('path', { required: false })

    if (user_path[0] == '/' || user_path[0] == '~' || user_path[0] == '$') {
        throw new Error("path must be relative to the workspace")
    }

    const tool_path = path.join(process.env.GITHUB_WORKSPACE, user_path)
    const arch = process.arch == "arm64" ? "arm64" : "x64"

    if (process.platform == "win32") {
        const gsc_tool = await download([base + version + "/windows-" + arch + "-release.zip"])
        await tc.extractZip(gsc_tool, tool_path)
    }
    else if (process.platform == "darwin" || process.platform == "linux") {
        const os = process.platform == "darwin" ? "macos" : "linux"
        const names = arch == "arm64" ? ["arm64"] : ["amd64", "x64"]
        const gsc_tool = await download(names.map(n => base + version + "/" + os + "-" + n + "-release.tar.gz"))
        await tc.extractTar(gsc_tool, tool_path)
    }
    else {
        throw new Error("unsupported platform")
    }

    core.addPath(tool_path)

    if (process.platform != "win32") {
        const bin_path = path.join(tool_path, "gsc-tool")
        await exec.exec(`chmod +x ${bin_path}`)
    }
}

main().catch(err => {
    core.setFailed(`failed to install gsc-tool: ${err}`);
})
