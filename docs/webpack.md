# Webpack usage examples

## Install yargs

Install yargs as a production dependency, as it will _not_ be included in the pack (not yet compatible):
```bash
$ npm install --save yargs
```

## Javascript setup (see below for typescript)

Install dev dependencies:
```bash
$ npm install --save-dev webpack webpack-cli
```

Create `src/index.js`:
```js
const yargs = require('yargs')

console.log(yargs.parse())
```

Create `webpack.config.js`:
```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  // Keep yargs as an external dependency
  externals: {
    'yargs': 'commonjs yargs'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  target: 'node'
}
```

## Typescript setup

Install dev dependencies:
```bash
$ npm install --save-dev ts-loader typescript webpack webpack-cli @types/yargs
```

Create `src/index.ts`:
```ts
import * as yargs from 'yargs';

console.log(yargs.parse());
```

Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "sourceMap": true
  }
}
```

Create `webpack.config.js`:
```js
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  // Keep yargs as an external dependency
  externals: {
    'yargs': 'commonjs yargs'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          'ts-loader',
        ]
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  target: 'node'
}
```

## Build

```bash
$ ./node_modules/.bin/webpack --mode=production
```

## Run

```bash
$ node dist/index.js
{ _: [], '$0': 'dist/index.js' }
```
