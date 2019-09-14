'use strict'
/* global describe, it */

const { expect } = require('chai')
const isPromise = require('../lib/is-promise')

describe('isPromise', () => {
  it('returns `false` on non promise value', () => {
    expect(isPromise('hello there.')).to.be.equal(false)
  })

  it('returns `true` on es6 promise', () => {
    const esPromise = new Promise(() => {})
    expect(isPromise(esPromise)).to.be.equal(true)
  })

  it('returns `true` on some other thenable', () => {
    const thenable = { then: () => {} }
    expect(isPromise(thenable)).to.be.equal(true)
  })

  it('returns `false` if some falsy value is passed', () => {
    expect(isPromise(null)).to.be.equal(false)
  })

  it('returns `false` if passed object has no `then` property', () => {
    expect(isPromise({})).to.be.equal(false)
  })

  it('returns `false` if `then` is not a function', () => {
    const obj = { then: 4711 }
    expect(isPromise(obj)).to.be.equal(false)
  })
})
