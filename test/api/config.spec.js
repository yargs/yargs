'use strict'
/* global describe, it, beforeEach, afterEach */

require('chai').should()
const expect = require('chai').expect
const fs = require('fs')
const path = require('path')
const YError = require('../../lib/yerror')

describe('config', () => {
  let yargs
  beforeEach(() => {
    yargs = require('../../')
  })

  afterEach(() => {
    delete require.cache[require.resolve('../../')]
    yargs = undefined
  })

  it('allows a parsing function to be provided as a second argument', () => {
    const argv = yargs('--config ./test/fixtures/config.json')
      .config('config', cfgPath => JSON.parse(fs.readFileSync(cfgPath)))
      .global('config', false)
      .argv

    argv.foo.should.equal('baz')
  })

  it('allows key to be specified with option shorthand', () => {
    const argv = yargs('--config ./test/fixtures/config.json')
      .option('config', {
        config: true,
        global: false
      })
      .argv

    argv.foo.should.equal('baz')
  })

  it('can be disabled with option shorthand', () => {
    const argv = yargs('--config ./test/fixtures/config.json')
      .option('config', {
        config: false,
        global: false
      })
      .argv

    argv.config.should.equal('./test/fixtures/config.json')
  })

  it('allows to pass a configuration object', () => {
    const argv = yargs
        .config({foo: 1, bar: 2})
        .argv

    argv.foo.should.equal(1)
    argv.bar.should.equal(2)
  })

  describe('extends', () => {
    it('applies default configurations when given config object', () => {
      const argv = yargs
        .config({
          extends: './test/fixtures/extends/config_1.json',
          a: 1
        })
        .argv

      argv.a.should.equal(1)
      argv.b.should.equal(22)
      argv.z.should.equal(15)
    })

    it('protects against circular extended configurations', () => {
      expect(() => {
        yargs.config({extends: './test/fixtures/extends/circular_1.json'})
      }).to.throw(YError)
    })

    it('handles aboslute paths', () => {
      const absolutePath = path.join(process.cwd(), 'test', 'fixtures', 'extends', 'config_1.json')

      const argv = yargs
        .config({
          a: 2,
          extends: absolutePath
        })
        .argv

      argv.a.should.equal(2)
      argv.b.should.equal(22)
      argv.z.should.equal(15)
    })

    // see: https://www.npmjs.com/package/yargs-test-extends
    it('allows a module to be extended, rather than a JSON file', () => {
      const argv = yargs()
        .config({
          a: 2,
          extends: 'yargs-test-extends'
        })
        .argv

      argv.a.should.equal(2)
      argv.c.should.equal(201)
    })

    it('ignores an extends key that does not look like a path or module', () => {
      const argv = yargs()
        .config({
          a: 2,
          extends: 'batman'
        })
        .argv

      argv.a.should.equal(2)
      argv.extends.should.equal('batman')
    })

    it('allows files with .*rc extension to be extended', () => {
      const argv = yargs()
        .config({
          extends: './test/fixtures/extends/.myrc',
          a: 3
        })
        .argv

      argv.a.should.equal(3)
      argv.b.should.equal(22)
      argv.c.should.equal(201)
      argv.z.should.equal(15)
    })
  })
})
