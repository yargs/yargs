'use strict'
/* global describe, it */

const middleware = require('../lib/middleware')

require('chai').should()

describe('middleware', () => {
  it('should add a list of callbacks to global middleware', () => {
    const globalMiddleware = []

    middleware(globalMiddleware, ['callback1', 'callback2'])

    globalMiddleware.should.have.lengthOf(2)
  })

  it('should add a single callback to global middleware', () => {
    const globalMiddleware = []

    middleware(globalMiddleware, {})

    globalMiddleware.should.have.lengthOf(1)
  })
})
