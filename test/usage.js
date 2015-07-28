/* global describe, it, beforeEach */

var checkUsage = require('./helpers/utils').checkOutput
var yargs = require('../')

require('chai').should()

describe('usage tests', function () {
  beforeEach(function () {
    yargs.reset()
  })

  describe('demand options', function () {
    describe('using .demand()', function () {
      it('should show an error along with the missing arguments on demand fail', function () {
        var r = checkUsage(function () {
          return yargs('-x 10 -z 20'.split(' '))
            .usage('Usage: $0 -x NUM -y NUM')
            .demand(['x', 'y'])
            .wrap(null)
            .argv
        })
        r.result.should.have.property('x', 10)
        r.result.should.have.property('z', 20)
        r.result.should.have.property('_').with.length(0)
        r.errors.join('\n').split(/\n+/).should.deep.equal([
          'Usage: ./usage -x NUM -y NUM',
          'Options:',
          '  -x  [required]',
          '  -y  [required]',
          'Missing required argument: y'
        ])
        r.logs.should.have.length(0)
        r.exit.should.be.ok
      })

      describe('using .require()', function () {
        it('should show an error along with the missing arguments on demand fail', function () {
          var r = checkUsage(function () {
            return yargs('-x 10 -z 20'.split(' '))
              .usage('Usage: $0 -x NUM -y NUM')
              .require(['x', 'y'])
              .wrap(null)
              .argv
          })
          r.result.should.have.property('x', 10)
          r.result.should.have.property('z', 20)
          r.result.should.have.property('_').with.length(0)
          r.errors.join('\n').split(/\n+/).should.deep.equal([
            'Usage: ./usage -x NUM -y NUM',
            'Options:',
            '  -x  [required]',
            '  -y  [required]',
            'Missing required argument: y'
          ])
          r.logs.should.have.length(0)
          r.exit.should.be.ok
        })
      })
    })

    it('should show an error along with a custom message on demand fail', function () {
      var r = checkUsage(function () {
        return yargs('-z 20'.split(' '))
        .usage('Usage: $0 -x NUM -y NUM')
        .demand(['x', 'y'], 'x and y are both required to multiply all the things')
        .wrap(null)
        .argv
      })
      r.result.should.have.property('z', 20)
      r.result.should.have.property('_').with.length(0)
      r.errors.join('\n').split(/\n+/).should.deep.equal([
        'Usage: ./usage -x NUM -y NUM',
        'Options:',
        '  -x  [required]',
        '  -y  [required]',
        'Missing required arguments: x, y',
        'x and y are both required to multiply all the things'
      ])
      r.logs.should.have.length(0)
      r.exit.should.be.ok
    })

    it('should return valid values when demand passes', function () {
      var r = checkUsage(function () {
        return yargs('-x 10 -y 20'.split(' '))
        .usage('Usage: $0 -x NUM -y NUM')
        .demand(['x', 'y'])
        .wrap(null)
        .argv
      })
      r.should.have.property('result')
      r.result.should.have.property('x', 10)
      r.result.should.have.property('y', 20)
      r.result.should.have.property('_').with.length(0)
      r.should.have.property('errors').with.length(0)
      r.should.have.property('logs').with.length(0)
      r.should.have.property('exit', false)
    })

    it('should not show a custom message if msg is null', function () {
      var r = checkUsage(function () {
        return yargs('')
          .usage('Usage: foo')
          .demand(1, null)
          .wrap(null)
          .argv
      })

      r.errors.join('\n').split(/\n+/).should.deep.equal([
        'Usage: foo',
        ''
      ])
    })

    // see #169.
    describe('min/max demanded count', function () {
      it("does not output an error if '_' count is within the min/max range", function () {
        var r = checkUsage(function () {
          return yargs(['foo', 'bar', 'apple'])
            .usage('Usage: foo')
            .demand(2, 3)
            .wrap(null)
            .argv
        })

        r.errors.length.should.equal(0)
      })

      it("outputs an error if '_' count is above max", function () {
        var r = checkUsage(function () {
          return yargs(['foo', 'bar', 'apple', 'banana'])
            .usage('Usage: foo')
            .demand(2, 3)
            .wrap(null)
            .argv
        })

        r.errors.join('\n').split(/\n+/).should.deep.equal([
          'Usage: foo',
          'Too many non-option arguments: got 4, maximum of 3'
        ])
      })

      it("outputs an error if '_' count is below min", function () {
        var r = checkUsage(function () {
          return yargs(['foo'])
            .usage('Usage: foo')
            .demand(2, 3)
            .wrap(null)
            .argv
        })

        r.errors.join('\n').split(/\n+/).should.deep.equal([
          'Usage: foo',
          'Not enough non-option arguments: got 1, need at least 2'
        ])
      })

      it('allows a customer error message to be provided', function () {
        var r = checkUsage(function () {
          return yargs(['foo'])
            .usage('Usage: foo')
            .demand(2, 3, 'pork chop sandwiches')
            .wrap(null)
            .argv
        })

        r.errors.join('\n').split(/\n+/).should.deep.equal([
          'Usage: foo',
          'pork chop sandwiches'
        ])
      })
    })
  })

  it('should return valid values when check passes', function () {
    var r = checkUsage(function () {
      return yargs('-x 10 -y 20'.split(' '))
      .usage('Usage: $0 -x NUM -y NUM')
      .check(function (argv) {
        if (!('x' in argv)) throw Error('You forgot about -x')
        if (!('y' in argv)) throw Error('You forgot about -y')
        else return true
      })
      .argv
    })
    r.should.have.property('result')
    r.result.should.have.property('x', 10)
    r.result.should.have.property('y', 20)
    r.result.should.have.property('_').with.length(0)
    r.should.have.property('errors').with.length(0)
    r.should.have.property('logs').with.length(0)
    r.should.have.property('exit', false)
  })

  it('should display missing arguments when check fails with a thrown exception', function () {
    var r = checkUsage(function () {
      return yargs('-x 10 -z 20'.split(' '))
        .usage('Usage: $0 -x NUM -y NUM')
        .wrap(null)
        .check(function (argv) {
          if (!('x' in argv)) throw Error('You forgot about -x')
          if (!('y' in argv)) throw Error('You forgot about -y')
        })
        .argv
    })
    r.should.have.property('result')
    r.result.should.have.property('x', 10)
    r.result.should.have.property('z', 20)
    r.result.should.have.property('_').with.length(0)
    r.errors.join('\n').split(/\n+/).should.deep.equal([
      'Usage: ./usage -x NUM -y NUM',
      'You forgot about -y'
    ])
    r.should.have.property('logs').with.length(0)
    r.should.have.property('exit').and.be.ok
  })

  it('should display missing arguments when check fails with a return value', function () {
    var r = checkUsage(function () {
      return yargs('-x 10 -z 20'.split(' '))
      .usage('Usage: $0 -x NUM -y NUM')
      .wrap(null)
      .check(function (argv) {
        if (!('x' in argv)) return 'You forgot about -x'
        if (!('y' in argv)) return 'You forgot about -y'
      })
      .argv
    })
    r.should.have.property('result')
    r.result.should.have.property('x', 10)
    r.result.should.have.property('z', 20)
    r.result.should.have.property('_').with.length(0)
    r.should.have.property('logs').with.length(0)
    r.should.have.property('exit').and.be.ok
    r.should.have.property('errors')
    r.errors.join('\n').split(/\n+/).should.deep.equal([
      'Usage: ./usage -x NUM -y NUM',
      'You forgot about -y'
    ])
  })

  it('should return a valid result when check condition passes', function () {
    function checker (argv) {
      return 'x' in argv && 'y' in argv
    }
    var r = checkUsage(function () {
      return yargs('-x 10 -y 20'.split(' '))
      .usage('Usage: $0 -x NUM -y NUM')
      .check(checker)
      .argv
    })
    r.should.have.property('result')
    r.result.should.have.property('x', 10)
    r.result.should.have.property('y', 20)
    r.result.should.have.property('_').with.length(0)
    r.should.have.property('errors').with.length(0)
    r.should.have.property('logs').with.length(0)
    r.should.have.property('exit', false)
  })

  it('should display a failed message when check condition fails', function () {
    function checker (argv) {
      return 'x' in argv && 'y' in argv
    }
    var r = checkUsage(function () {
      return yargs('-x 10 -z 20'.split(' '))
      .usage('Usage: $0 -x NUM -y NUM')
      .check(checker)
      .wrap(null)
      .argv
    })
    r.should.have.property('result')
    r.result.should.have.property('x', 10)
    r.result.should.have.property('z', 20)
    r.result.should.have.property('_').with.length(0)
    r.should.have.property('logs').with.length(0)
    r.should.have.property('exit').and.be.ok
    r.should.have.property('errors')
    r.errors.join('\n').split(/\n+/).join('\n').should.equal(
      'Usage: ./usage -x NUM -y NUM\n' +
      'Argument check failed: ' + checker.toString()
    )
  })

  it('should return a valid result when demanding a count of non-hyphenated values', function () {
    var r = checkUsage(function () {
      return yargs('1 2 3 --moo'.split(' '))
      .usage('Usage: $0 [x] [y] [z] {OPTIONS}')
      .demand(3)
      .argv
    })
    r.should.have.property('result')
    r.should.have.property('errors').with.length(0)
    r.should.have.property('logs').with.length(0)
    r.should.have.property('exit', false)
    r.result.should.have.property('_').and.deep.equal([1, 2, 3])
    r.result.should.have.property('moo', true)
  })

  it('should return a failure message when not enough non-hyphenated arguments are found after a demand count', function () {
    var r = checkUsage(function () {
      return yargs('1 2 --moo'.split(' '))
      .usage('Usage: $0 [x] [y] [z] {OPTIONS}')
      .demand(3)
      .wrap(null)
      .argv
    })
    r.should.have.property('result')
    r.should.have.property('logs').with.length(0)
    r.should.have.property('exit').and.be.ok
    r.result.should.have.property('_').and.deep.equal([1, 2])
    r.result.should.have.property('moo', true)
    r.should.have.property('errors')
    r.errors.join('\n').split(/\n+/).should.deep.equal([
      'Usage: ./usage [x] [y] [z] {OPTIONS}',
      'Not enough non-option arguments: got 2, need at least 3'
    ])
  })

  it('should return a custom failure message when not enough non-hyphenated arguments are found after a demand count', function () {
    var r = checkUsage(function () {
      return yargs('src --moo'.split(' '))
      .usage('Usage: $0 [x] [y] [z] {OPTIONS} <src> <dest> [extra_files...]')
      .demand(2, 'src and dest files are both required')
      .wrap(null)
      .argv
    })
    r.should.have.property('result')
    r.should.have.property('logs').with.length(0)
    r.should.have.property('exit').and.be.ok
    r.result.should.have.property('_').and.deep.equal(['src'])
    r.result.should.have.property('moo', true)
    r.should.have.property('errors')
    r.errors.join('\n').split(/\n+/).should.deep.equal([
      'Usage: ./usage [x] [y] [z] {OPTIONS} <src> <dest> [extra_files...]',
      'src and dest files are both required'
    ])
  })

  it('should return a valid result when setting defaults for singles', function () {
    var r = checkUsage(function () {
      return yargs('--foo 50 --baz 70 --powsy'.split(' '))
      .default('foo', 5)
      .default('bar', 6)
      .default('baz', 7)
      .argv

    })
    r.should.have.property('result')
    r.result.should.have.property('foo', 50)
    r.result.should.have.property('bar', 6)
    r.result.should.have.property('baz', 70)
    r.result.should.have.property('powsy', true)
    r.result.should.have.property('_').with.length(0)
  })

  it('should return a valid result when default is set for an alias', function () {
    var r = checkUsage(function () {
      return yargs('')
      .alias('f', 'foo')
      .default('f', 5)
      .argv

    })
    r.should.have.property('result')
    r.result.should.have.property('f', 5)
    r.result.should.have.property('foo', 5)
    r.result.should.have.property('_').with.length(0)
  })

  it('should print a single line when failing and default is set for an alias', function () {
    var r = checkUsage(function () {
      return yargs('')
        .alias('f', 'foo')
        .default('f', 5)
        .demand(1)
        .wrap(null)
        .argv
    })
    r.errors.join('\n').split(/\n+/).should.deep.equal([
      'Options:',
      '  -f, --foo  [default: 5]',
      'Not enough non-option arguments: got 0, need at least 1'
    ])
  })

  it('should allow you to set default values for a hash of options', function () {
    var r = checkUsage(function () {
      return yargs('--foo 50 --baz 70'.split(' '))
      .default({ foo: 10, bar: 20, quux: 30 })
      .argv

    })
    r.should.have.property('result')
    r.result.should.have.property('_').with.length(0)
    r.result.should.have.property('foo', 50)
    r.result.should.have.property('baz', 70)
    r.result.should.have.property('bar', 20)
    r.result.should.have.property('quux', 30)
  })

  describe('required arguments', function () {
    describe('with options object', function () {
      it('should show a failure message if a required option is missing', function () {
        var r = checkUsage(function () {
          var opts = {
            foo: { description: 'foo option', alias: 'f', requiresArg: true },
            bar: { description: 'bar option', alias: 'b', requiresArg: true }
          }

          return yargs('-f --bar 20'.split(' '))
          .usage('Usage: $0 [options]', opts)
          .wrap(null)
          .argv
        })
        r.should.have.property('result')
        r.result.should.have.property('_').with.length(0)
        r.should.have.property('errors')
        r.should.have.property('logs').with.length(0)
        r.should.have.property('exit').and.be.ok
        r.errors.join('\n').split(/\n+/).should.deep.equal([
          'Usage: ./usage [options]',
          'Options:',
          '  --foo, -f  foo option',
          '  --bar, -b  bar option',
          'Missing argument value: foo'
        ])
      })

      it('should show a failure message if more than one required option is missing', function () {
        var r = checkUsage(function () {
          var opts = {
            foo: { description: 'foo option', alias: 'f', requiresArg: true },
            bar: { description: 'bar option', alias: 'b', requiresArg: true }
          }

          return yargs('-f --bar'.split(' '))
          .usage('Usage: $0 [options]', opts)
          .wrap(null)
          .argv
        })
        r.should.have.property('result')
        r.result.should.have.property('_').with.length(0)
        r.should.have.property('errors')
        r.should.have.property('logs').with.length(0)
        r.should.have.property('exit').and.be.ok
        r.errors.join('\n').split(/\n+/).should.deep.equal([
          'Usage: ./usage [options]',
          'Options:',
          '  --foo, -f  foo option',
          '  --bar, -b  bar option',
          'Missing argument values: foo, bar'
        ])
      })
    })

    describe('with requiresArg method', function () {
      it('should show a failure message if a required option is missing', function () {
        var r = checkUsage(function () {
          var opts = {
            foo: { description: 'foo option', alias: 'f' },
            bar: { description: 'bar option', alias: 'b' }
          }

          return yargs('-f --bar 20'.split(' '))
          .usage('Usage: $0 [options]', opts)
          .requiresArg(['foo', 'bar'])
          .wrap(null)
          .argv
        })
        r.should.have.property('result')
        r.result.should.have.property('_').with.length(0)
        r.should.have.property('errors')
        r.should.have.property('logs').with.length(0)
        r.should.have.property('exit').and.be.ok
        r.errors.join('\n').split(/\n+/).should.deep.equal([
          'Usage: ./usage [options]',
          'Options:',
          '  --foo, -f  foo option',
          '  --bar, -b  bar option',
          'Missing argument value: foo'
        ])
      })
    })

    it("still requires argument if 'type' hints are given", function () {
      var r = checkUsage(function () {
        return yargs('--foo --bar'.split(' '))
          .requiresArg('foo')
          .string('foo')
          .requiresArg('bar')
          .array('bar')
          .wrap(null)
          .argv
      })

      r.errors[1].should.equal('Missing argument values: foo, bar')
    })
  })

  describe('with strict() option set', function () {
    it('should fail given an option argument that is not demanded', function () {
      var r = checkUsage(function () {
        var opts = {
          foo: { demand: 'foo option', alias: 'f' },
          bar: { demand: 'bar option', alias: 'b' }
        }

        return yargs('-f 10 --bar 20 --baz 30'.split(' '))
        .usage('Usage: $0 [options]', opts)
        .strict()
        .wrap(null)
        .argv
      })

      r.should.have.property('result')
      r.result.should.have.property('_').with.length(0)
      r.result.should.have.property('f', 10)
      r.result.should.have.property('foo', 10)
      r.result.should.have.property('b', 20)
      r.result.should.have.property('bar', 20)
      r.result.should.have.property('baz', 30)
      r.should.have.property('errors')
      r.errors.join('\n').split(/\n+/).should.deep.equal([
        'Usage: ./usage [options]',
        'Options:',
        '  --foo, -f  [required]',
        '  --bar, -b  [required]',
        'Unknown argument: baz'
      ])
      r.should.have.property('logs').with.length(0)
      r.should.have.property('exit').and.be.ok
    })

    it('should fail given an option argument without a corresponding description', function () {
      var r = checkUsage(function () {
        var opts = {
          foo: { description: 'foo option', alias: 'f' },
          bar: { description: 'bar option', alias: 'b' }
        }

        return yargs('-f 10 --bar 20 --baz 30'.split(' '))
        .usage('Usage: $0 [options]', opts)
        .strict()
        .wrap(null)
        .argv
      })

      r.should.have.property('result')
      r.result.should.have.property('_').with.length(0)
      r.result.should.have.property('f', 10)
      r.result.should.have.property('foo', 10)
      r.result.should.have.property('b', 20)
      r.result.should.have.property('bar', 20)
      r.result.should.have.property('baz', 30)
      r.should.have.property('errors')
      r.errors.join('\n').split(/\n+/).should.deep.equal([
        'Usage: ./usage [options]',
        'Options:',
        '  --foo, -f  foo option',
        '  --bar, -b  bar option',
        'Unknown argument: baz'
      ])
      r.should.have.property('logs').with.length(0)
      r.should.have.property('exit').and.be.ok
    })

    it('should fail given multiple option arguments without corresponding descriptions', function () {
      var r = checkUsage(function () {
        var opts = {
          foo: { description: 'foo option', alias: 'f' },
          bar: { description: 'bar option', alias: 'b' }
        }

        return yargs('-f 10 --bar 20 --baz 30 -q 40'.split(' '))
          .usage('Usage: $0 [options]', opts)
          .strict()
          .wrap(null)
          .argv
      })

      r.should.have.property('result')
      r.result.should.have.property('_').with.length(0)
      r.result.should.have.property('f', 10)
      r.result.should.have.property('foo', 10)
      r.result.should.have.property('b', 20)
      r.result.should.have.property('bar', 20)
      r.result.should.have.property('baz', 30)
      r.result.should.have.property('q', 40)
      r.should.have.property('errors')
      r.errors.join('\n').split(/\n+/).should.deep.equal([
        'Usage: ./usage [options]',
        'Options:',
        '  --foo, -f  foo option',
        '  --bar, -b  bar option',
        'Unknown arguments: baz, q'
      ])
      r.should.have.property('logs').with.length(0)
      r.should.have.property('exit').and.be.ok
    })

    it('should pass given option arguments with corresponding descriptions', function () {
      var r = checkUsage(function () {
        var opts = {
          foo: { description: 'foo option' },
          bar: { description: 'bar option' }
        }

        return yargs('--foo 10 --bar 20'.split(' '))
          .usage('Usage: $0 [options]', opts)
          .strict()
          .argv
      })

      r.should.have.property('result')
      r.result.should.have.property('foo', 10)
      r.result.should.have.property('bar', 20)
      r.result.should.have.property('_').with.length(0)
      r.should.have.property('errors').with.length(0)
      r.should.have.property('logs').with.length(0)
      r.should.have.property('exit', false)
    })
  })

  it('should display example on fail', function () {
    var r = checkUsage(function () {
      return yargs('')
        .example('$0 something', 'description')
        .example('$0 something else', 'other description')
        .demand(['y'])
        .wrap(null)
        .argv
    })
    r.should.have.property('result')
    r.result.should.have.property('_').with.length(0)
    r.should.have.property('errors')
    r.should.have.property('logs').with.length(0)
    r.should.have.property('exit').and.be.ok
    r.errors.join('\n').split(/\n+/).should.deep.equal([
      'Options:',
      '  -y  [required]',
      'Examples:',
      '  ./usage something       description',
      '  ./usage something else  other description',
      'Missing required argument: y'
    ])
  })

  describe('demand option with boolean flag', function () {
    describe('with demand option', function () {
      it('should report missing required arguments', function () {
        var r = checkUsage(function () {
          return yargs('-y 10 -z 20'.split(' '))
            .usage('Usage: $0 -x NUM [-y NUM]')
            .options({
              'x': { description: 'an option', demand: true },
              'y': { description: 'another option', demand: false }
            })
            .wrap(null)
            .argv
        })
        r.result.should.have.property('y', 10)
        r.result.should.have.property('z', 20)
        r.result.should.have.property('_').with.length(0)
        r.errors.join('\n').split(/\n/).should.deep.equal([
          'Usage: ./usage -x NUM [-y NUM]',
          '',
          'Options:',
          '  -x  an option  [required]',
          '  -y  another option',
          '',
          'Missing required argument: x'
        ])
        r.logs.should.have.length(0)
        r.exit.should.be.ok
      })
    })

    describe('with required option', function () {
      it('should report missing required arguments', function () {
        var r = checkUsage(function () {
          return yargs('-y 10 -z 20'.split(' '))
            .usage('Usage: $0 -x NUM [-y NUM]')
            .options({
              'x': { description: 'an option', required: true },
              'y': { description: 'another option', required: false }
            })
            .wrap(null)
            .argv
        })
        r.result.should.have.property('y', 10)
        r.result.should.have.property('z', 20)
        r.result.should.have.property('_').with.length(0)
        r.errors.join('\n').split(/\n/).should.deep.equal([
          'Usage: ./usage -x NUM [-y NUM]',
          '',
          'Options:',
          '  -x  an option  [required]',
          '  -y  another option',
          '',
          'Missing required argument: x'
        ])
        r.logs.should.have.length(0)
        r.exit.should.be.ok
      })
    })

    it('should not report missing required arguments when given an alias', function () {
      var r = checkUsage(function () {
        return yargs('-w 10'.split(' '))
        .usage('Usage: $0 --width NUM [--height NUM]')
        .options({
          'width': { description: 'Width', alias: 'w', demand: true },
          'height': { description: 'Height', alias: 'h', demand: false }
        })
        .wrap(null)
        .argv
      })
      r.result.should.have.property('w', 10)
      r.result.should.have.property('_').with.length(0)
      r.should.have.property('errors').with.length(0)
      r.logs.should.have.length(0)
    })
  })

  describe('help option', function () {
    it('should display usage', function () {
      var r = checkUsage(function () {
        return yargs(['--help'])
          .demand(['y'])
          .help('help')
          .wrap(null)
          .argv
      })
      r.should.have.property('result')
      r.result.should.have.property('_').with.length(0)
      r.should.have.property('errors')
      r.should.have.property('logs').with.length(1)
      r.should.have.property('exit').and.be.ok
      r.logs.join('\n').split(/\n+/).should.deep.equal([
        'Options:',
        '  --help  Show help  [boolean]',
        '  -y  [required]',
        ''
      ])
    })

    it('should not show both dashed and camelCase aliases', function () {
      var r = checkUsage(function () {
        return yargs(['--help'])
          .usage('Usage: $0 options')
          .help('help')
          .describe('some-opt', 'Some option')
          .default('some-opt', 2)
          .wrap(null)
          .argv
      })
      r.should.have.property('result')
      r.result.should.have.property('_').with.length(0)
      r.should.have.property('exit').and.be.ok
      r.should.have.property('errors').with.length(0)
      r.should.have.property('logs')
      r.logs.join('\n').split(/\n+/).should.deep.equal([
        'Usage: ./usage options',
        'Options:',
        '  --help      Show help  [boolean]',
        '  --some-opt  Some option  [default: 2]',
        ''
      ])
    })
  })

  describe('version option', function () {
    it('should display version', function () {
      var r = checkUsage(function () {
        return yargs(['--version'])
        .version('1.0.1', 'version', 'Show version number')
        .wrap(null)
        .argv
      })
      r.should.have.property('result')
      r.result.should.have.property('_').with.length(0)
      r.should.have.property('errors')
      r.should.have.property('logs').with.length(1)
      r.should.have.property('exit').and.be.ok
      r.logs[0].should.eql('1.0.1')
    })

    it('should allow a function to be provided, rather than a number', function () {
      var r = checkUsage(function () {
        return yargs(['--version'])
        .version(function () {
          return require('./fixtures/config').version
        }, 'version')
        .wrap(null)
        .argv
      })
      r.logs[0].should.eql('1.0.2')
    })

    it("should default to 'version' as version option", function () {
      var r = checkUsage(function () {
        return yargs(['--version'])
        .version(function () {
          return require('./fixtures/config').version
        })
        .wrap(null)
        .argv
      })
      r.logs[0].should.eql('1.0.2')
    })
  })

  describe('showHelpOnFail', function () {
    it('should display user supplied message', function () {
      var opts = {
        foo: { desc: 'foo option', alias: 'f' },
        bar: { desc: 'bar option', alias: 'b' }
      }

      var r = checkUsage(function () {
        return yargs(['--foo'])
        .usage('Usage: $0 [options]')
        .options(opts)
        .demand(['foo', 'bar'])
        .showHelpOnFail(false, 'Specify --help for available options')
        .wrap(null)
        .argv
      })
      r.should.have.property('result')
      r.result.should.have.property('_').with.length(0)
      r.should.have.property('errors')
      r.should.have.property('logs').with.length(0)
      r.should.have.property('exit').and.be.ok
      r.errors.join('\n').split(/\n/).should.deep.equal([
        'Missing required argument: bar',
        '',
        'Specify --help for available options'
      ])
    })
  })

  describe('exitProcess', function () {
    it('should not call process.exit on error if disabled', function () {
      var opts = {
        foo: { desc: 'foo option', alias: 'f' }
      }

      var r = checkUsage(function () {
        return yargs(['--foo'])
          .exitProcess(false)
          .usage('Usage: $0 [options]')
          .options(opts)
          .demand(['foo'])
          .wrap(null)
          .argv
      })
      r.should.have.property('result')
      r.result.should.have.property('_').with.length(0)
      r.should.have.property('errors')
      r.should.have.property('logs').with.length(0)
      r.should.have.property('exit').and.be.false
    })
  })

  it('should succeed when rebase', function () {
    yargs.rebase('/home/chevex', '/home/chevex/foo/bar/baz').should.equal('foo/bar/baz')
    yargs.rebase('/home/chevex/foo/bar/baz', '/home/chevex').should.equal('../../..')
    yargs.rebase('/home/chevex/foo', '/home/chevex/pow/zoom.txt').should.equal('../pow/zoom.txt')
  })

  // Fixes: https://github.com/chevex/yargs/issues/71
  it('should not raise an exception if help called on empty arguments', function () {
    var r = checkUsage(function () {
      return yargs([]).usage('foo').help()
    })

    r.result.should.match(/foo/)
  })

  describe('wrap', function () {
    it('should wrap argument descriptions onto multiple lines', function () {
      var r = checkUsage(function () {
        return yargs([])
        .option('fairly-long-option', {
          alias: 'f',
          default: 'fairly-long-default',
          description: 'npm prefix used to locate globally installed npm packages'
        })
        .demand('foo')
        .wrap(50)
        .argv
      })

      r.errors[0].split('\n').forEach(function (line, i) {
        if (!i || !line) return // ignore first and last line.
        line.length.should.lte(50)
      })
    })

    it('should wrap based on window-size if no wrap is provided', function () {
      var width = require('window-size').width

      var r = checkUsage(function () {
        return yargs([])
          .option('fairly-long-option', {
            alias: 'f',
            // create a giant string that should wrap.
            description: new Array(width * 5).join('s')
          })
          .demand('foo')
          .argv
      })

      // the long description should cause several line
      // breaks when wrapped.
      r.errors[0].split('\n').length.should.gt(4)
    })

    it('should not raise an exception when long default and description are provided', function () {
      return yargs([])
      .option('fairly-long-option', {
        alias: 'f',
        default: 'npm prefix used to locate globally installed npm packages',
        description: 'npm prefix used to locate globally installed npm packages'
      })
      .wrap(40)
      .help()
    })

    it('should wrap the left-hand-column if it takes up more than 50% of the screen', function () {
      var r = checkUsage(function () {
        return yargs([])
          .example(
            'i am a fairly long example',
            'description that is also fairly long'
          )
          .demand('foo')
          .wrap(40)
          .argv
      })

      // should split example usage onto multiple lines.
      r.errors[0].split('\n').length.should.equal(8)

      // should wrap within appropriate boundaries.
      r.errors[0].split('\n').forEach(function (line, i) {
        // ignore headings and blank lines.
        if (!line || line.match('Examples:') || line.match('Options:')) return

        line.length.should.lte(40)
      })
    })

    it('should wrap the usage string', function () {
      var r = checkUsage(function () {
        return yargs([])
        .usage('i am a fairly long usage string look at me go.')
        .demand('foo')
        .wrap(20)
        .argv
      })

      // the long usage string should cause line-breaks.
      r.errors[0].split('\n').length.should.gt(6)
    })
  })

  describe('commands', function () {
    it('should output a list of available commands', function () {
      var r = checkUsage(function () {
        return yargs('')
          .command('upload', 'upload something')
          .command('download', 'download something from somewhere')
          .demand('y')
          .wrap(null)
          .argv
      })

      r.errors.join('\n').split(/\n+/).should.deep.equal([
        'Commands:',
        '  upload    upload something',
        '  download  download something from somewhere',
        'Options:',
        '  -y  [required]',
        'Missing required argument: y'
      ])
    })

    it('should not show hidden commands', function () {
      var r = checkUsage(function () {
        return yargs('')
          .command('upload', 'upload something')
          .command('secret', false)
          .demand('y')
          .wrap(null)
          .argv
      })

      r.errors.join('\n').split(/\s+/).should.deep.equal([
        'Commands:',
        'upload', 'upload', 'something',
        'Options:',
        '-y', '[required]',
        'Missing', 'required', 'argument:', 'y'
      ])
    })

    it('allows completion command to be hidden', function () {
      var r = checkUsage(function () {
        return yargs('')
          .command('upload', 'upload something')
          .completion('completion', false)
          .demand('y')
          .wrap(null)
          .argv
      })

      r.errors.join('\n').split(/\s+/).should.deep.equal([
        'Commands:',
        'upload', 'upload', 'something',
        'Options:',
        '-y', '[required]',
        'Missing', 'required', 'argument:', 'y'
      ])
    })
  })

  describe('epilogue', function () {
    it('should display an epilog message at the end of the usage instructions', function () {
      var r = checkUsage(function () {
        return yargs('')
          .epilog('for more info view the manual at http://example.com')
          .demand('y')
          .wrap(null)
          .argv
      })

      r.errors.join('\n').split(/\n+/).should.deep.equal([
        'Options:',
        '  -y  [required]',
        'for more info view the manual at http://example.com',
        'Missing required argument: y'
      ])
    })

    it('replaces $0 in epilog string', function () {
      var r = checkUsage(function () {
        return yargs('')
          .epilog("Try '$0 --long-help' for more information")
          .demand('y')
          .wrap(null)
          .argv
      })

      r.errors.join('\n').split(/\n+/).should.deep.equal([
        'Options:',
        '  -y  [required]',
        'Try \'./usage --long-help\' for more information',
        'Missing required argument: y'
      ])
    })
  })

  describe('default', function () {
    it('should indicate that the default is a generated-value, if function is provided', function () {
      var r = checkUsage(function () {
        return yargs(['-h'])
          .help('h')
          .default('f', function () {
            return 99
          })
          .wrap(null)
          .argv
      })

      r.logs[0].should.include('default: (generated-value)')
    })

    it('if a named function is provided, should use name rather than (generated-value)', function () {
      var r = checkUsage(function () {
        return yargs(['-h'])
          .help('h')
          .default('f', function randomNumber () {
            return Math.random() * 256
          })
          .wrap(null)
          .argv
      })

      r.logs[0].should.include('default: (random-number)')
    })

    it('default-description take precedence if one is provided', function () {
      var r = checkUsage(function () {
        return yargs(['-h'])
          .help('h')
          .default('f', function randomNumber () {
            return Math.random() * 256
          }, 'foo-description')
          .wrap(null)
          .argv
      })

      r.logs[0].should.include('default: foo-description')
    })

    it('serializes object and array defaults', function () {
      var r = checkUsage(function () {
        return yargs(['-h'])
        .help('h')
        .default('a', [])
        .default('a2', [3])
        .default('o', {a: '33'})
        .wrap(null)
        .argv
      })

      r.logs[0].should.include('default: []')
      r.logs[0].should.include('default: {"a":"33"}')
      r.logs[0].should.include('default: [3]')
    })
  })

  describe('normalizeAliases', function () {
    // see #128
    it("should display 'description' string in help message if set for alias", function () {
      var r = checkUsage(function () {
        return yargs(['-h'])
          .describe('foo', 'foo option')
          .alias('f', 'foo')
          .help('h')
          .wrap(null)
          .argv
      })

      r.logs.join('\n').split(/\n+/).should.deep.equal([
        'Options:',
        '  -h         Show help  [boolean]',
        '  -f, --foo  foo option',
        ''
      ])
    })

    it("should display 'required' string in help message if set for alias", function () {
      var r = checkUsage(function () {
        return yargs(['-h'])
          .demand('foo')
          .alias('f', 'foo')
          .help('h')
          .wrap(null)
          .argv
      })

      r.logs.join('\n').split(/\n+/).should.deep.equal([
        'Options:',
        '  -h         Show help  [boolean]',
        '  -f, --foo  [required]',
        ''
      ])
    })

    it("should display 'type' string in help message if set for alias", function () {
      var r = checkUsage(function () {
        return yargs(['-h'])
          .string('foo')
          .describe('foo', 'bar')
          .alias('f', 'foo')
          .help('h')
          .wrap(null)
          .argv
      })

      r.logs.join('\n').split(/\n+/).should.deep.equal([
        'Options:',
        '  -h         Show help  [boolean]',
        '  -f, --foo  bar  [string]',
        ''
      ])
    })
  })

  describe('showHelp', function (done) {
    // see #143.
    it('should show help regardless of whether argv has been called', function () {
      var r = checkUsage(function () {
        var y = yargs(['--foo'])
          .options('foo', {
            alias: 'f',
            describe: 'foo option'
          })
          .wrap(null)

        y.showHelp()
      })

      r.errors.join('\n').split(/\n+/).should.deep.equal([
        'Options:',
        '  --foo, -f  foo option',
        ''
      ])
    })
  })

  describe('$0', function () {
    function mockProcessArgv (argv, cb) {
      var argvOld = process.argv
      process.argv = argv
      // cb must be sync for now
      try {
        cb()
        process.argv = argvOld
      } catch (err) {
        process.argv = argvOld
        throw err
      }
    }

    it('is detected correctly for a basic script', function () {
      mockProcessArgv(['script.js'], function () {
        yargs([]).$0.should.equal('script.js')
      })
    })

    it('is detected correctly when argv contains "node"', function () {
      mockProcessArgv(['node', 'script.js'], function () {
        yargs([]).$0.should.equal('script.js')
      })
    })

    it('is detected correctly when dirname contains "node"', function () {
      mockProcessArgv(['/code/node/script.js'], function () {
        yargs([]).$0.should.equal('/code/node/script.js')
      })
    })

    it('is detected correctly when dirname and argv contain "node"', function () {
      mockProcessArgv(['node', '/code/node/script.js'], function () {
        yargs([]).$0.should.equal('/code/node/script.js')
      })
    })

    it('is detected correctly when argv contains "iojs"', function () {
      mockProcessArgv(['iojs', 'script.js'], function () {
        yargs([]).$0.should.equal('script.js')
      })
    })

    it('is detected correctly when dirname contains "iojs"', function () {
      mockProcessArgv(['/code/iojs/script.js'], function () {
        yargs([]).$0.should.equal('/code/iojs/script.js')
      })
    })

    it('is detected correctly when dirname and argv contain "iojs"', function () {
      mockProcessArgv(['iojs', '/code/iojs/script.js'], function () {
        yargs([]).$0.should.equal('/code/iojs/script.js')
      })
    })
  })

  describe('choices', function () {
    it('should output choices when defined for non-hidden options', function () {
      var r = checkUsage(function () {
        return yargs(['--help'])
          .option('answer', {
            describe: 'does this look good?',
            choices: ['yes', 'no', 'maybe']
          })
          .option('confidence', {
            describe: 'percentage of confidence',
            choices: [0, 25, 50, 75, 100]
          })
          .help('help')
          .wrap(null)
          .argv
      })

      r.logs[0].split('\n').should.deep.equal([
        'Options:',
        '  --answer      does this look good?  [choices: "yes", "no", "maybe"]',
        '  --confidence  percentage of confidence  [choices: 0, 25, 50, 75, 100]',
        '  --help        Show help  [boolean]',
        ''
      ])
    })

    it('should not output choices when defined for hidden options', function () {
      var r = checkUsage(function () {
        return yargs(['--help'])
          .option('answer', {
            type: 'string',
            choices: ['yes', 'no', 'maybe']
          })
          .option('confidence', {
            choices: [0, 25, 50, 75, 100]
          })
          .help('help')
          .wrap(null)
          .argv
      })

      r.logs[0].split('\n').should.deep.equal([
        'Options:',
        '  --help  Show help  [boolean]',
        ''
      ])
    })
  })

  describe('count', function () {
    it('should indicate when an option is a count', function () {
      var r = checkUsage(function () {
        return yargs(['--help'])
          .option('verbose', {
            describe: 'verbose level',
            count: true
          })
          .help('help')
          .wrap(null)
          .argv
      })

      r.logs.join(' ').should.match(/\[count\]/)
    })
  })

  describe('array', function () {
    it('should indicate when an option is an array', function () {
      var r = checkUsage(function () {
        return yargs(['--help'])
          .option('arr', {
            describe: 'array option',
            array: true
          })
          .help('help')
          .wrap(null)
          .argv
      })

      r.logs.join(' ').should.match(/\[array\]/)
    })
  })
})
