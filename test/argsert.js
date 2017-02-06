/* global describe, it */

const argsert = require('../lib/argsert')
const expect = require('chai').expect

require('chai').should()

describe('Argsert', function () {
  it('does not throw exception if optional argument is not provided', function () {
    argsert('[object]', [].slice.call(arguments))
  })

  it('throws exception if wrong type is provided for optional argument', function () {
    function foo (opts) {
      argsert('[object|number]', [].slice.call(arguments))
    }
    expect(function () {
      foo('hello')
    }).to.throw(/Invalid first argument. Expected object or number but received string./)
  })

  it('does not throw exception if optional argument is valid', function () {
    function foo (opts) {
      argsert('[object]', [].slice.call(arguments))
    }
    foo({foo: 'bar'})
  })

  it('throws exception if required argument is not provided', function () {
    expect(function () {
      argsert('<object>', [].slice.call(arguments))
    }).to.throw(/Not enough arguments provided. Expected 1 but received 0./)
  })

  it('throws exception if required argument is of wrong type', function () {
    function foo (opts) {
      argsert('<object>', [].slice.call(arguments))
    }
    expect(function () {
      foo('bar')
    }).to.throw(/Invalid first argument. Expected object but received string./)
  })

  it('supports a combination of required and optional arguments', function () {
    function foo (opts) {
      argsert('<array> <string|object> [string|object]', [].slice.call(arguments))
    }
    foo([], 'foo', {})
  })

  it('throws an exception if too many arguments are provided', function () {
    function foo (expected) {
      argsert('<array> [batman]', [].slice.call(arguments))
    }
    expect(function () {
      foo([], 33, 99)
    }).to.throw(/Too many arguments provided. Expected max 2 but received 3./)
  })

  it('configures function to accept 0 parameters, if only arguments object is provided', function () {
    function foo (expected) {
      argsert([].slice.call(arguments))
    }
    expect(function () {
      foo(99)
    }).to.throw(/Too many arguments provided. Expected max 0 but received 1./)
  })

  it('allows for any type if * is provided', function () {
    function foo (opts) {
      argsert('<*>', [].slice.call(arguments))
    }
    foo('bar')
  })

  it('should ignore trailing undefined values', function () {
    function foo (opts) {
      argsert('<*>', [].slice.call(arguments))
    }
    foo('bar', undefined, undefined)
  })

  it('should not ignore undefined values that are not trailing', function () {
    function foo (opts) {
      argsert('<*>', [].slice.call(arguments))
    }
    expect(function () {
      foo('bar', undefined, undefined, 33)
    }).to.throw(/Too many arguments provided. Expected max 1 but received 4./)
  })

  it('supports null as special type', function () {
    function foo (arg) {
      argsert('<null>', [].slice.call(arguments))
    }
    foo(null)
  })
})
