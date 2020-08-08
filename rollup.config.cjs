const ts = require('@wessberg/rollup-plugin-ts')

const output = {
  format: 'cjs',
  file: './build/index.cjs',
  exports: 'default'
}

if (process.env.NODE_ENV === 'test') output.sourcemap = true

module.exports = {
  input: './lib/cjs.ts',
  output,
  plugins: [
    ts({ /* options */ })
  ]
}
