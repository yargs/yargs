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
import * as yargs from 'yargs';

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

Webpack will emit the following warnings, which can be safely ignored as long as you do not use yargs functions performing dynamic module imports, such as `commandDir` or `config`:

```
WARNING in ./node_modules/yargs/index.js 12:39-46
Critical dependency: require function is used in a way in which dependencies cannot be statically extracted
 @ ./src/index.js

WARNING in ./node_modules/yargs/yargs.js 370:33-40
Critical dependency: require function is used in a way in which dependencies cannot be statically extracted
 @ ./node_modules/yargs/index.js
 @ ./src/index.js

WARNING in ./node_modules/yargs/yargs.js 525:83-90
Critical dependency: require function is used in a way in which dependencies cannot be statically extracted
 @ ./node_modules/yargs/index.js
 @ ./src/index.js

WARNING in ./node_modules/require-main-filename/index.js 2:25-32
Critical dependency: require function is used in a way in which dependencies cannot be statically extracted
 @ ./node_modules/yargs/yargs.js
 @ ./node_modules/yargs/index.js
 @ ./src/index.js

WARNING in ./node_modules/yargs/lib/apply-extends.js 42:24-55
Critical dependency: the request of a dependency is an expression
 @ ./node_modules/yargs/yargs.js
 @ ./node_modules/yargs/index.js
 @ ./src/index.js

WARNING in ./node_modules/yargs/lib/apply-extends.js 57:82-105
Critical dependency: the request of a dependency is an expression
 @ ./node_modules/yargs/yargs.js
 @ ./node_modules/yargs/index.js
 @ ./src/index.js

WARNING in ./node_modules/yargs/node_modules/yargs-parser/index.js 534:21-48
Critical dependency: the request of a dependency is an expression
 @ ./node_modules/yargs/yargs.js
 @ ./node_modules/yargs/index.js
 @ ./src/index.js
```

## Run

```bash
$ rm -rf node_modules
$ node dist/index.js
{ _: [], '$0': 'dist/index.js' }
```

## Keeping yargs as an external dependency

If you choose not to include yargs in the pack, to keep it as an external dependency (to get rid of webpack warnings, for example), you need then to install it as a production dependency, no longer a development one:

```bash
$ npm install --save yargs
```

And to add the following lines in `webpack.config.js`:

```js
module.exports = {
  ...
  externals: {
    'yargs': 'commonjs yargs'
  },
  ...
}
```
