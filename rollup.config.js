import ts from '@wessberg/rollup-plugin-ts'

const output = {
  format: 'cjs',
  file: './build/index.cjs',
  exports: 'default'
}

if (process.env.NODE_ENV === 'test') output.sourcemap = true

export default {
  input: './yargs.ts',
  output,
  plugins: [
    ts({ /* options */ })
  ]
}
