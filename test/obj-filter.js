'use strict'
/* global describe, it */

const objFilter = require('../lib/obj-filter')

require('chai').should()

describe('ObjFilter', () => {
  it('returns a new reference to the original object if no filter function is given', () => {
    const original = { foo: 'bar', baz: 'foo' }
    const result = objFilter(original)

    original.should.not.equal(result)
    original.should.deep.equal(result)
  })
})
