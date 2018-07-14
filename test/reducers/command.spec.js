'use strict'
/* global describe, it */

require('chai').should()

describe.skip('command reducer', () => {
  const { addCommandHandlers } = require('../../actions/command')
  const commandReducer = require('../../reducers/command')

  it('should add command handler', () => {
    commandReducer(undefined, addCommandHandlers('test parsed cmd', 'test cmd', 'test decription', null, null, null, null))
  })
})
