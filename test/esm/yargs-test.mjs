/* global describe, it */

import * as assert from 'assert'
import yargs from '../../index.mjs'

describe('ESM', () => {
  describe('parser', () => {
    it('parses process.argv by default', () => {
      const parsed = yargs(['--goodnight', 'moon']).parse()
      assert.strictEqual(parsed.goodnight, 'moon')
    })
    // TODO: add test for hiding process.argv arguments.
  })
})
