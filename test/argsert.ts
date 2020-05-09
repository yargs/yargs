/* global describe, it */
import { argsert } from '../lib/argsert'
import { checkOutput } from './helpers/utils'
import { should } from 'chai'

should()

describe('Argsert', () => {
  it('does not warn if optional argument is not provided', () => {
    const o = checkOutput(function (...args: any[]) {
      argsert('[object]', [].slice.call(args))
    })

    o.warnings.length.should.equal(0)
  })

  it('warn if wrong type is provided for optional argument', () => {
    const o = checkOutput(() => {
      function foo (...args: any[]) {
        argsert('[object|number]', [].slice.call(args))
      }

      foo('hello')
    })

    o.warnings[0].should.match(/Invalid first argument. Expected object or number but received string./)
  })

  it('does not warn if optional argument is valid', () => {
    const o = checkOutput(() => {
      function foo (...args: any[]) {
        argsert('[object]', [].slice.call(args))
      }

      foo({ foo: 'bar' })
    })

    o.warnings.length.should.equal(0)
  })

  it('warns if required argument is not provided', () => {
    const o = checkOutput(function (...args: any[]) {
      argsert('<object>', [].slice.call(args))
    })

    o.warnings[0].should.match(/Not enough arguments provided. Expected 1 but received 0./)
  })

  it('warns if required argument is of wrong type', () => {
    const o = checkOutput(() => {
      function foo (...args: any[]) {
        argsert('<object>', [].slice.call(args))
      }

      foo('bar')
    })

    o.warnings[0].should.match(/Invalid first argument. Expected object but received string./)
  })

  it('supports a combination of required and optional arguments', () => {
    const o = checkOutput(() => {
      function foo (...args: any[]) {
        argsert('<array> <string|object> [string|object]', [].slice.call(args))
      }

      foo([], 'foo', {})
    })

    o.warnings.length.should.equal(0)
  })

  it('warns if too many arguments are provided', () => {
    const o = checkOutput(() => {
      function foo (...args: any[]) {
        argsert('<array> [batman]', [].slice.call(args))
      }

      foo([], 33, 99)
    })

    o.warnings[0].should.match(/Too many arguments provided. Expected max 2 but received 3./)
  })

  it('warn with argument position if wrong type is provided for argument', () => {
    const o = checkOutput(() => {
      function foo (...args: any[]) {
        argsert('<string> <string> <string>', [].slice.call(args))
      }

      foo('hello', 'ayy', {})
    })

    o.warnings[0].should.match(/Invalid third argument. Expected string but received obj./)
  })

  it('warn with generic argument position if wrong type is provided for seventh or greater argument', () => {
    const o = checkOutput(() => {
      function foo (...args: any[]) {
        argsert('<string> <string> <string> <string> <string> <string> <string>', [].slice.call(args))
      }

      foo('a', 'b', 'c', 'd', 'e', 'f', 10)
    })

    o.warnings[0].should.match(/Invalid manyith argument. Expected string but received number./)
  })

  it('configures function to accept 0 parameters, if only arguments object is provided', () => {
    const o = checkOutput(() => {
      function foo (...args: any[]) {
        argsert([].slice.call(args))
      }

      foo(99)
    })

    o.warnings[0].should.match(/Too many arguments provided. Expected max 0 but received 1./)
  })

  it('allows for any type if * is provided', () => {
    const o = checkOutput(() => {
      function foo (...args: any[]) {
        argsert('<*>', [].slice.call(args))
      }

      foo('bar')
    })

    o.warnings.length.should.equal(0)
  })

  it('should ignore trailing undefined values', () => {
    const o = checkOutput(() => {
      function foo (...args: any[]) {
        argsert('<*>', [].slice.call(args))
      }

      foo('bar', undefined, undefined)
    })

    o.warnings.length.should.equal(0)
  })

  it('should not ignore undefined values that are not trailing', () => {
    const o = checkOutput(() => {
      function foo (...args: any[]) {
        argsert('<*>', [].slice.call(args))
      }

      foo('bar', undefined, undefined, 33)
    })

    o.warnings[0].should.match(/Too many arguments provided. Expected max 1 but received 4./)
  })

  it('supports null as special type', () => {
    const o = checkOutput(() => {
      function foo (...args: any[]) {
        argsert('<null>', [].slice.call(args))
      }
      foo(null)
    })

    o.warnings.length.should.equal(0)
  })
})
