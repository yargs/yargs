'use strict';

const {describe, it} = require('mocha');
const assert = require('assert');
const yargs = require('../yargs');
const {applyExtends} = require('../yargs');

const HELPER_COUNT = 2;

describe('helpers', () => {
  it('does not expose additional helpers beyond blessed list', () => {
    assert.strictEqual(Object.keys(yargs).length, HELPER_COUNT);
  });
  describe('applyExtends', () => {
    it('exposes applyExtends helper', () => {
      const conf = applyExtends(
        {extends: './package.json', apple: 'red'},
        process.cwd(),
        true
      );
      assert.strictEqual(conf.name, 'yargs'); // loads packge.json.
      assert.strictEqual(conf.apple, 'red'); // keeps config with extends.
    });
  });
  describe('Parser', () => {
    it('exposes functional argument parser', () => {
      const argv = yargs.Parser('--foo --bar=99');
      assert.strictEqual(argv.bar, 99);
    });
  });
});
