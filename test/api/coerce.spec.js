'use strict'
/* global describe, it, beforeEach, afterEach */

require('chai').should()
const expect = require('chai').expect
const fs = require('fs')
const path = require('path')

describe('.coerce()', () => {
  let yargs
  beforeEach(() => {
    yargs = require('../../')
  })

  afterEach(() => {
    delete require.cache[require.resolve('../../')]
  })

  it('supports string and function args (as option key and coerce function)', () => {
    const argv = yargs(['--file', path.join(__dirname, '../fixtures', 'package.json')])
      .coerce('file', arg => JSON.parse(fs.readFileSync(arg, 'utf8')))
      .argv
    expect(argv.file).to.have.property('version').and.equal('9.9.9')
  })

  it('supports object arg (as map of multiple options)', () => {
    const argv = yargs('--expand abc --range 1..3')
      .coerce({
        expand (arg) {
          return arg.split('')
        },
        range (arg) {
          const arr = arg.split('..').map(Number)
          return { begin: arr[0], end: arr[1] }
        }
      })
      .argv
    expect(argv.expand).to.deep.equal(['a', 'b', 'c'])
    expect(argv.range).to.have.property('begin').and.equal(1)
    expect(argv.range).to.have.property('end').and.equal(3)
  })

  it('supports array and function args (as option keys and coerce function)', () => {
    const argv = yargs(['--src', 'in', '--dest', 'out'])
      .coerce(['src', 'dest'], arg => path.resolve(arg))
      .argv
    argv.src.should.match(/in/).and.have.length.above(2)
    argv.dest.should.match(/out/).and.have.length.above(3)
  })

  it('allows an error to be handled by fail() handler', () => {
    let msg
    let err
    let jsonErrMessage
    yargs('--json invalid')
      .coerce('json', (arg) => {
        try {
          JSON.parse(arg)
        } catch (err) {
          jsonErrMessage = err.message
        }
        return JSON.parse(arg)
      })
      .fail((m, e) => {
        msg = m
        err = e
      })
      .argv
    expect(msg).to.equal(jsonErrMessage)
    expect(err).to.exist
  })

  it('supports an option alias', () => {
    const argv = yargs('-d 2016-08-12')
      .coerce('date', Date.parse)
      .alias('date', 'd')
      .argv
    argv.date.should.equal(1470960000000)
  })

  it('supports a global option within command', () => {
    let regex
    yargs('check --regex x')
      .global('regex')
      .coerce('regex', RegExp)
      .command('check', 'Check something', {}, (argv) => {
        regex = argv.regex
      })
      .argv
    expect(regex).to.be.an.instanceof(RegExp)
    regex.toString().should.equal('/x/')
  })

  it('is supported by .option()', () => {
    const argv = yargs('--env SHELL=/bin/bash')
      .option('env', {
        coerce (arg) {
          const arr = arg.split('=')
          return { name: arr[0], value: arr[1] || '' }
        }
      })
      .argv
    expect(argv.env).to.have.property('name').and.equal('SHELL')
    expect(argv.env).to.have.property('value').and.equal('/bin/bash')
  })

  it('supports positional and variadic args for a command', () => {
    let age
    let dates
    yargs('add 30days 2016-06-13 2016-07-18')
      .command('add <age> [dates..]', 'Testing', yargs => yargs
          .coerce('age', arg => parseInt(arg, 10) * 86400000)
          .coerce('dates', arg => arg.map(str => new Date(str))), (argv) => {
            age = argv.age
            dates = argv.dates
          })
      .argv
    expect(age).to.equal(2592000000)
    expect(dates).to.have.lengthOf(2)
    dates[0].toString().should.equal(new Date('2016-06-13').toString())
    dates[1].toString().should.equal(new Date('2016-07-18').toString())
  })

  it('returns camelcase args for a command', () => {
    let age1
    let age2
    let dates
    yargs('add 30days 2016-06-13 2016-07-18')
      .command('add <age-in-days> [dates..]', 'Testing', yargs => yargs
          .coerce('age-in-days', arg => parseInt(arg, 10) * 86400000)
          .coerce('dates', arg => arg.map(str => new Date(str))), (argv) => {
            age1 = argv.ageInDays
            age2 = argv['age-in-days']
            dates = argv.dates
          })
      .argv
    expect(age1).to.equal(2592000000)
    expect(age2).to.equal(2592000000)
    expect(dates).to.have.lengthOf(2)
    dates[0].toString().should.equal(new Date('2016-06-13').toString())
    dates[1].toString().should.equal(new Date('2016-07-18').toString())
  })

  it('allows an error from positional arg to be handled by fail() handler', () => {
    let msg
    let err
    yargs('throw ball')
      .command('throw <msg>', false, yargs => yargs
          .coerce('msg', (arg) => {
            throw new Error(arg)
          })
          .fail((m, e) => {
            msg = m
            err = e
          }))
      .argv
    expect(msg).to.equal('ball')
    expect(err).to.exist
  })
})
