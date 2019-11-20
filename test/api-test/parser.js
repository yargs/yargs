'use strict'
/* global it */

const Parser = require('yargs-parser')

require('chai').should()

module.exports = function (yargs) {
  it('should expose yargs-parser as Parser', () => {
    yargs.Parser.should.equal(Parser)
  })
}
