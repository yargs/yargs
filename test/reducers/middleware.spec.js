'use strict'
/* global describe, it */

require('chai').should()

describe('middleware reducer', () => {
  const { getMiddleware, addMiddleware, resetMiddleware } = require('../../actions/middleware')
  const middlewareReducer = require('../../reducers/middleware')
  it('should get middleware', () => {
    middlewareReducer({
      middleware: []
    }, getMiddleware()).middleware.should.have.length(0)
  })

  it('should add middleware', () => {
    middlewareReducer(undefined, addMiddleware(['callback1', 'callback2'])).middleware.should.have.length(2)
    middlewareReducer(undefined, addMiddleware({})).middleware.should.have.length(1)
  })

  it('should reset middleware', function () {
    middlewareReducer({ middleware: ['callback1', 'callback2'], someOtherKey: 'test' }, resetMiddleware()).middleware.should.have.length(0)
  })

  it('should return state by default', function () {
    middlewareReducer({
      middleware: []
    }).middleware.should.have.length(0)
  })
})
