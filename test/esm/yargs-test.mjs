/* global describe, it */

import * as assert from 'assert';
import yargs from '../../index.mjs';

describe('ESM', () => {
  describe('parser', () => {
    it('parses process.argv by default', () => {
      const parsed = yargs(['--goodnight', 'moon']).parse();
      assert.strictEqual(parsed.goodnight, 'moon');
    });
  });
  describe('commandDir', () => {
    it('throws an error if commndDir() used in ESM mode', () => {
      let err;
      try {
        yargs().commandDir('./');
      } catch (_err) {
        err = _err;
      }
      assert.match(err.message, /not supported yet for ESM/);
    });
  });
  // Handling of strings that look like numbers, see:
  // https://github.com/yargs/yargs/issues/1758
  describe('bug #1758', () => {
    it('does not drop .0 if positional is configured as string', () => {
      const argv = yargs('cmd 33.0')
        .command('cmd [str]', 'a command', yargs => {
          return yargs.positional('str', {
            type: 'string',
          });
        })
        .parse();
      assert.strictEqual(argv.str, '33.0');
    });
  });
});
