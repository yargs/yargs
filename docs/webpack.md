# Webpack usage examples

## Install dependencies

```bash
$ npm install --save-dev webpack webpack-cli yargs
```

Additional dependencies for typescript users:

```bash
$ npm install --save-dev ts-loader typescript @types/yargs
```

## Sample program

Create `src/index.js`:
```js
const yargs = require('yargs')

console.log(yargs.parse())
```

Or for typescript users, `src/index.ts`:
```ts
import yargs = require('yargs');

console.log(yargs.parse());
```

along with its `tsconfig.json`:
```json
{
  "compilerOptions": {
    "sourceMap": true
  }
}
```

## Webpack configuration

Create `webpack.config.js`:
```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  stats: {
    // Ignore warnings due to yarg's dynamic module loading
    warningsFilter: [/node_modules\/yargs/]
  },
  target: 'node'
}
```

For typescript users, replace :

```js
module.exports = {
  entry: './src/index.js',
  ...
}
```

by:

```js
module.exports = {
  entry: './src/index.ts',
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
  resolve: {
    extensions: ['.ts', '.js'],
  },
  ...
}
```

## Build

```bash
$ ./node_modules/.bin/webpack --mode=production
```

## Run

```bash
$ rm -rf node_modules
$ node dist/index.js
{ _: [], '$0': 'dist/index.js' }
```
