/* global describe, it */

import * as assert from 'assert';
import shim from '../../lib/platform-shims/esm.mjs';

describe('platform-shim', () => {
  describe('y18n', () => {
    describe('__', () => {
      it('behaves like sprintf', () => {
        const str = shim.y18n.__('hello %s, goodnight %s', 'world', 'moon');
        assert.strictEqual(str, 'hello world, goodnight moon');
      });
    });
    describe('__n', () => {
      it('uses first string if singular', () => {
        const str = shim.y18n.__n(
          'Missing required argument: %s',
          'Missing required arguments: %s',
          1,
          'foo, bar'
        );
        assert.strictEqual(str, 'Missing required argument: foo, bar');
      });
      it('uses second string if plural', () => {
        const str = shim.y18n.__n(
          'Missing required argument: %s',
          'Missing required arguments: %s',
          2,
          'foo, bar'
        );
        assert.strictEqual(str, 'Missing required arguments: foo, bar');
      });
    });
  });
});
