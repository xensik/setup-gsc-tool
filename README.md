# Setup GSC Tool

Github action to setup GSC Tool

## Inputs

- `version` :
The version of GSC Tool to use. Default `'1.3.0'`.

- `path` :
The path GSC Tool is installed to. Default `'.gsc-tool'`.

## Usage

### Example usage with defaults

```yaml
uses: xensik/setup-gsc-tool@v1
```

### Example usage with version

```yaml
uses: xensik/setup-gsc-tool@v1
with:
  version: '1.3.0'
```

### Example usage with path

```yaml
uses: xensik/setup-gsc-tool@v1
with:
  version: '1.3.0'
  path: '.gsc-tool'
```
