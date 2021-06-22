'use strict';

import * as assert from 'assert';
import {applyExtends, hideBin, Parser} from '../../helpers/helpers.mjs';
import {describe, it} from 'mocha';

describe('helpers', () => {
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
      const argv = Parser('--foo --bar=99');
      assert.strictEqual(argv.bar, 99);
    });
  });
  describe('hideBin', () => {
    it('hides bin for standard node.js application', () => {
      const args = hideBin(['node', 'foo.js', '--apple', '--banana']);
      assert.deepEqual(args, ['--apple', '--banana']);
    });
  });
});
