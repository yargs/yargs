## Bundling yargs

This document outlines how to bundle your libraries that use yargs into
standalone distributions.

### You might not need to bundle

Newer releases of yargs can run directly in modern browsers, take a look at
[Running yargs in the browser](https://github.com/yargs/yargs/blob/master/docs/browser.md).

### Webpack

Given a CommonJS file, **index.js**:

```js
const yargs = require('yargs')
const chalk = require('chalk')
yargs
  .option('awesome-opt', {
    describe: `my awesome ${chalk.green('option')}`
  })
  .parse()
```

You can create a CommonJS bundle with the following `webpack.config.js`:

```js
module.exports = {
  mode: "development",
  entry: {
    index: "./index.js",
  },
  output: {
    filename: './index.js'
  },
  resolve: {
    extensions: ['.js', '.cjs', '.json']
  },
  target: 'node',
  devtool: "source-map-inline",
  externals: {
    'cliui': 'commonjs2 cliui',
    'y18n': 'commonjs2 y18n',
    'yargs-parser': 'commonjs2 yargs-parser',
  },
};
```
