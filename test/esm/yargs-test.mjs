/* global describe, it */

import * as assert from 'assert'
import yargs from '../../index.mjs'

describe('ESM', () => {
  describe('parser', () => {
    it('parses process.argv by default', () => {
      const parsed = yargs(['--goodnight', 'moon']).parse()
      assert.strictEqual(parsed.goodnight, 'moon')
    })
  })
  describe('commandDir',  () => {
    it('throws an error if commndDir() used in ESM mode', () => {
      let err;
      try {
        yargs().commandDir('./')
      } catch (_err) {
        err = _err
      }
      assert.match(err.message, /not supported yet for ESM/)
    })
  })
})
