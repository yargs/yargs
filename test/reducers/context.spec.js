'use strict'
/* global describe, it */

require('chai').should()
const expect = require('chai').expect

describe('context reducer', () => {
  const { getContext, incrementContextResets, addFileToContext } = require('../../actions/context')
  const contextReducer = require('../../reducers/context')
  it('should get context', () => {
    Object.keys(contextReducer(undefined, getContext())).should.have.length(4)
  })

  it('should increment resets by 1', () => {
    expect(contextReducer(undefined, incrementContextResets()).resets).to.equal(0)
  })

  it('should add file to files', () => {
    expect(contextReducer(undefined, addFileToContext('some/file/path')).files.length).to.equal(1)
  })
})
