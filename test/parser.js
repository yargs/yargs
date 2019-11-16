'use strict'
/* global it */

const yargs = require('../yargs')
const Parser = require('yargs-parser')

require('chai').should()

it('should expose yargs-parser as Parser', () => {
  yargs.Parser.should.equal(Parser)
})
