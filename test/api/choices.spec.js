'use strict'
/* global describe, it, beforeEach, afterEach */

require('chai').should()
let yargs

describe('choices', () => {
  beforeEach(() => {
    yargs = require('../../')
  })

  afterEach(() => {
    delete require.cache[require.resolve('../../')]
    yargs = undefined
  })

  it('accepts an object', () => {
    const optChoices = yargs([])
      .choices({
        color: ['red', 'green', 'blue'],
        stars: [1, 2, 3, 4, 5]
      })
      .choices({
        size: ['xl', 'l', 'm', 's', 'xs']
      })
      .getOptions().choices

    optChoices.should.deep.equal({
      color: ['red', 'green', 'blue'],
      stars: [1, 2, 3, 4, 5],
      size: ['xl', 'l', 'm', 's', 'xs']
    })
  })

  it('accepts a string and array', () => {
    const optChoices = yargs([])
      .choices('meat', ['beef', 'chicken', 'pork', 'bison'])
      .choices('temp', ['rare', 'med-rare', 'med', 'med-well', 'well'])
      .getOptions().choices

    optChoices.should.deep.equal({
      meat: ['beef', 'chicken', 'pork', 'bison'],
      temp: ['rare', 'med-rare', 'med', 'med-well', 'well']
    })
  })

  it('accepts a string and single value', () => {
    const optChoices = yargs([])
      .choices('gender', 'male')
      .choices('gender', 'female')
      .getOptions().choices

    optChoices.should.deep.equal({
      gender: ['male', 'female']
    })
  })
})
