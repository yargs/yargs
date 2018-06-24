'use strict'
/* global describe, it */

require('chai').should()

describe('middleware reducer', () => {
  const { addMiddleware, resetMiddleware } = require('../../actions/middleware')
  const middlewareReducer = require('../../reducers/middleware')

  it('should add middleware', () => {
    middlewareReducer(undefined, addMiddleware(['callback1', 'callback2'])).should.have.length(2)
    middlewareReducer(undefined, addMiddleware({})).should.have.length(1)
  })

  it('should reset middleware', function () {
    middlewareReducer(['callback1', 'callback2'], resetMiddleware()).should.have.length(0)
  })

  it('should return state by default', function () {
    middlewareReducer([]).should.have.length(0)
  })
})
