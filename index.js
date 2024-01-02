const core = require("@actions/core")
const exec = require('@actions/exec');
const tc = require("@actions/tool-cache")
const path = require("path")

async function main() {
    const version = core.getInput('version', { required: true })
    const user_path = core.getInput('path', { required: false })

    if (user_path[0] == '/' || user_path[0] == '~' || user_path[0] == '$') {
        throw new Error("path must be relative to the workspace")
    }

    const tool_path = path.join(process.env.GITHUB_WORKSPACE, user_path)

    if (process.platform == "win32") {
        const url = "https://github.com/xensik/gsc-tool/releases/download/" + version + "/windows-x64-release.zip"
        const gsc_tool = await tc.downloadTool(url)
        await tc.extractZip(gsc_tool, tool_path)
    }
    else if (process.platform == "darwin") {
        const arch = process.arch == "arm64" ? "arm64" : "x64"
        const url = "https://github.com/xensik/gsc-tool/releases/download/" + version + "/macos-" + arch + "-release.tar.gz"
        const gsc_tool = await tc.downloadTool(url)
        await tc.extractTar(gsc_tool, tool_path)
    }
    else if (process.platform == "linux") {
        const arch = process.arch == "arm64" ? "arm64" : "x64"
        const url = "https://github.com/xensik/gsc-tool/releases/download/" + version + "/linux-" + arch + "-release.tar.gz"
        const gsc_tool = await tc.downloadTool(url)
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
