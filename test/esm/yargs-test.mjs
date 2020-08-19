/* global describe, it */

import * as assert from 'assert'
import { Yargs, getProcessArgvWithoutBin } from '../../index.mjs'

describe('ESM', () => {
  describe('parser', () => {
    it('parses process.argv by default', () => {
      const parsed = Yargs(['--goodnight', 'moon']).parse()
      assert.strictEqual(parsed.goodnight, 'moon')
    })
  })
  describe('commandDir',  () => {
    it('throws an error if commndDir() used in ESM mode', () => {
      let err;
      try {
        Yargs().commandDir('./')
      } catch (_err) {
        err = _err
      }
      assert.match(err.message, /not supported yet for ESM/)
    })
  })
  describe('getProcessArgvWithoutBin', () => {
    it('hides bin for standard node.js application', () => {
      process.argv = ['node', 'foo.js', '--apple', '--banana']
      const args = getProcessArgvWithoutBin()
      assert.deepEqual(args, ['--apple', '--banana'])
    })
  })
})
