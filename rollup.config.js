const babel = require('rollup-plugin-babel')

module.exports = {
  entry: './yargs.js',
  dest: './dist/bundle.js',
  format: 'cjs',
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ],
  external: [ 'fs', 'path' ]
}
