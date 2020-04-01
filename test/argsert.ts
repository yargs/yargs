'use strict'
/* global describe, it */

const argsert = require('../lib/argsert')
const checkOutput = require('../build/test/helpers/utils').checkOutput

require('chai').should()

describe('Argsert', () => {
  it('does not warn if optional argument is not provided', () => {
    const o = checkOutput(function () {
      argsert('[object]', [].slice.call(arguments))
    })

    o.warnings.length.should.equal(0)
  })

  it('warn if wrong type is provided for optional argument', () => {
    const o = checkOutput(() => {
      function foo (opts) {
        argsert('[object|number]', [].slice.call(arguments))
      }

      foo('hello')
    })

    o.warnings[0].should.match(/Invalid first argument. Expected object or number but received string./)
  })

  it('does not warn if optional argument is valid', () => {
    const o = checkOutput(() => {
      function foo (opts) {
        argsert('[object]', [].slice.call(arguments))
      }

      foo({ foo: 'bar' })
    })

    o.warnings.length.should.equal(0)
  })

  it('warns if required argument is not provided', () => {
    const o = checkOutput(function () {
      argsert('<object>', [].slice.call(arguments))
    })

    o.warnings[0].should.match(/Not enough arguments provided. Expected 1 but received 0./)
  })

  it('warns if required argument is of wrong type', () => {
    const o = checkOutput(() => {
      function foo (opts) {
        argsert('<object>', [].slice.call(arguments))
      }

      foo('bar')
    })

    o.warnings[0].should.match(/Invalid first argument. Expected object but received string./)
  })

  it('supports a combination of required and optional arguments', () => {
    const o = checkOutput(() => {
      function foo (opts) {
        argsert('<array> <string|object> [string|object]', [].slice.call(arguments))
      }

      foo([], 'foo', {})
    })

    o.warnings.length.should.equal(0)
  })

  it('warns if too many arguments are provided', () => {
    const o = checkOutput(() => {
      function foo (expected) {
        argsert('<array> [batman]', [].slice.call(arguments))
      }

      foo([], 33, 99)
    })

    o.warnings[0].should.match(/Too many arguments provided. Expected max 2 but received 3./)
  })

  it('warn with argument position if wrong type is provided for argument', () => {
    const o = checkOutput(() => {
      function foo (opts) {
        argsert('<string> <string> <string>', [].slice.call(arguments))
      }

      foo('hello', 'ayy', {})
    })

    o.warnings[0].should.match(/Invalid third argument. Expected string but received obj./)
  })

  it('warn with generic argument position if wrong type is provided for seventh or greater argument', () => {
    const o = checkOutput(() => {
      function foo (opts) {
        argsert('<string> <string> <string> <string> <string> <string> <string>', [].slice.call(arguments))
      }

      foo('a', 'b', 'c', 'd', 'e', 'f', 10)
    })

    o.warnings[0].should.match(/Invalid manyith argument. Expected string but received number./)
  })

  it('configures function to accept 0 parameters, if only arguments object is provided', () => {
    const o = checkOutput(() => {
      function foo (expected) {
        argsert([].slice.call(arguments))
      }

      foo(99)
    })

    o.warnings[0].should.match(/Too many arguments provided. Expected max 0 but received 1./)
  })

  it('allows for any type if * is provided', () => {
    const o = checkOutput(() => {
      function foo (opts) {
        argsert('<*>', [].slice.call(arguments))
      }

      foo('bar')
    })

    o.warnings.length.should.equal(0)
  })

  it('should ignore trailing undefined values', () => {
    const o = checkOutput(() => {
      function foo (opts) {
        argsert('<*>', [].slice.call(arguments))
      }

      foo('bar', undefined, undefined)
    })

    o.warnings.length.should.equal(0)
  })

  it('should not ignore undefined values that are not trailing', () => {
    const o = checkOutput(() => {
      function foo (opts) {
        argsert('<*>', [].slice.call(arguments))
      }

      foo('bar', undefined, undefined, 33)
    })

    o.warnings[0].should.match(/Too many arguments provided. Expected max 1 but received 4./)
  })

  it('supports null as special type', () => {
    const o = checkOutput(() => {
      function foo (arg) {
        argsert('<null>', [].slice.call(arguments))
      }
      foo(null)
    })

    o.warnings.length.should.equal(0)
  })
})
