# Developing yargs

## Using Node.js runtime

Install a version of [Node.js](https://nodejs.org/) /
[Node Version Manager](https://github.com/nvm-sh/nvm) directly on your machine
or use [devcontainers](https://code.visualstudio.com/docs/remote/containers)
with your local installation of [VSCode](https://code.visualstudio.com) or in
the cloud with [GitHub Codespaces](https://github.com/features/codespaces).

### Using devcontainers

To use devcontainers (locally or in the cloud), create a `.devcontainer` folder
in the root of the project and in this directory add these files:

`devcontainer.json`

```json
{
  "build": {
    "dockerfile": "Dockerfile",
    "args": {
      "VARIANT": "16"
    }
  },
  "settings": {},
  "extensions": ["dbaeumer.vscode-eslint", "esbenp.prettier-vscode"],
  "postCreateCommand": "npm install",
  "remoteUser": "node"
}
```

`Dockerfile`

```docker
ARG VARIANT="16"
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-${VARIANT}
```

Locally, make sure [Docker](https://www.docker.com/products/docker-desktop/) is
installed along with the
[Remote Development](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)
VSCode extension. Now open the project, and from the Command Palette choose
"Remote-Containers: Rebuild and Reopen in Container". Note that building your
environment the first time may take some time.

When using Codespaces, getting started is as simple as pressing the green "Code"
button on the projects GitHub homepage, selecting the "Codespaces" tab and then
clicking the "Create codespace on main" button.

## Install dependencies

Run `npm install`.

## Testing

Run `npm test && npm run test:esm`.

## Formatting code

Run `npm run fix`.

## Compilation

Run `npm run compile`.
