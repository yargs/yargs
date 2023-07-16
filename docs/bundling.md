## Bundling yargs

This document outlines how to bundle your libraries that use yargs into
standalone distributions.

### You might not need to bundle

Newer releases of yargs can run directly in modern browsers, take a look at
[Running yargs in the browser](https://github.com/yargs/yargs/blob/main/docs/browser.md).

## ncc

If you are targeting Node.js with your bundle, we recommend using
[`@vercel/ncc`](https://www.npmjs.com/package/@vercel/ncc).

Given a CommonJS file, **index.js**:

```js
const yargs = require('yargs/yargs')
const chalk = require('chalk')
require('yargs/yargs')(process.argv.slice(2))
  .option('awesome-opt', {
    describe: `my awesome ${chalk.green('option')}`
  })
  .parse()
```

You can simply run: `ncc build index.js`.

### Webpack

_The following is tested with webpack 5.x_

In a new project (see: [npm-init](https://docs.npmjs.com/cli/v7/commands/npm-init)):

1. `npm install yargs assert path-browserify`.
2. Create the following **index.js**:
    ```js
    const yargs = require('yargs/yargs')
    require('yargs/yargs')(process.argv.slice(2))
      .option('awesome-opt', {
        describe: `my awesome option`
      })
      .parse()
    ```
3. Create the following **webpack.config.js**:
    ```js
    const path = require('path');

    module.exports = {
      mode: 'development',
      devtool: 'source-map',
      entry: './index.js',
      output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
      },
      resolve: {
        fallback: {
          assert: require.resolve("assert"),
          fs: false,
          path: require.resolve("path-browserify")
        },
      },
    };
    ```
4. Run: `npx webpack@5 --config webpack.config.js`.
5. You can now execute `dist/bundle.js`.

## esbuild
The following is tested with esbuild@0.13
In a new project (see: [npm-init](https://docs.npmjs.com/cli/v7/commands/npm-init)):
1. `npm install esbuild yargs`
2. Create the following **index.js**
```js
const yargs = require('yargs')
const argv = yargs(process.argv).parse()

if (argv.ships > 3 && argv.distance < 53.5) {
  console.log('Plunder more riffiwobbles!')
} else {
  console.log('Retreat from the xupptumblers!')
}
```
3. Runt `npx esbuild index.js --bundle --outfile=bundle.js --platform=node --target=node12`
4. You can now execute `node bundle.js`.