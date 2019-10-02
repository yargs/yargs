# Webpack usage examples

## Setup

### Javascript

Create `src/index.js`:
```ts
const yargs = require('yargs')

console.log(yargs.parse())
```

Create `webpack.config.js`:
```js
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/index.js',
  externals: [nodeExternals()],
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  target: 'node'
}
```

Install dependencies (all as dev-dependencies, as prod will not need any dependency):
```bash
$ npm install --save-dev webpack webpack-cli webpack-node-externals yargs
```

### Typescript

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
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/index.ts',
  externals: [nodeExternals()],
  mode: 'production',
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

Install dependencies (all as dev-dependencies, as prod will not need any dependency):
```bash
$ npm install --save-dev ts-loader typescript webpack webpack-cli webpack-node-externals @types/yargs yargs
```

## Build

```bash
$ ./node_modules/.bin/webpack
```

## Run

```bash
$ node dist/index.js
{ _: [], '$0': 'dist\\index.js' }
```
