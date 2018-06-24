const babel = require('rollup-plugin-babel')

module.exports = {
  input: './index.js',
  output: {
    file: './dist/bundle.js',
    format: 'cjs'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ],
  external: [ 'fs', 'path' ]
}
