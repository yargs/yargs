const cleanup = require('rollup-plugin-cleanup');
const ts = require('rollup-plugin-ts');
const terser = require('@rollup/plugin-terser');

const output = {
  format: 'cjs',
  file: './build/index.cjs',
  exports: 'default',
};

const plugins = [
  ts(),
  cleanup({
    comments: 'none',
    extensions: ['*'],
  }),
];
if (process.env.NODE_ENV === 'test') {
  // During development include a source map. We don't ship this to npm,
  // because it significantly increases the module size:
  output.sourcemap = true;
} else {
  // Minify code when publishing, this significantly decreases the module
  // size increased introduced by shipping both ESM and CJS:
  plugins.push(terser());
}

module.exports = {
  input: './lib/cjs.ts',
  output,
  plugins,
};
