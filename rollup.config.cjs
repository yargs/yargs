const ts = require('@wessberg/rollup-plugin-ts')
const { terser } = require("rollup-plugin-terser")

const output = {
  format: 'cjs',
  file: './build/index.cjs',
  exports: 'default'
}

const plugins = [
  ts()
]
if (process.env.NODE_ENV === 'test') output.sourcemap = true
// TODO: investigate why source maps are slightly broken with terser.
else plugins.push(terser())

module.exports = {
  input: './lib/cjs.ts',
  output,
  plugins
}
