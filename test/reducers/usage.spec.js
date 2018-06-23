'use strict'
/* global describe, it */

require('chai').should()
const expect = require('chai').expect

describe('usage reducer', () => {
  const {
    setShowHelpOnFail,
    setCommands,
    setExamples,
    setDescriptions,
    addCommand,
    addExample,
    addDescription,
    resetUsage,
    freezeUsage,
    unfreezeUsage
  } = require('../../actions/usage')
  const usageReducer = require('../../reducers/usage')
  it('should enable and set help messaging when typeof enabled is string', () => {
    const result = usageReducer({
      failMessage: null,
      showHelpOnFail: true,
      failureOutput: false,
      frozen: {}
    }, setShowHelpOnFail('This message displays on failure.'))
    expect(result.failMessage).to.equal('This message displays on failure.')
    expect(result.showHelpOnFail).to.equal(true)
  })

  it('should enable and set help messaging when typeof enabled is undefined', () => {
    const result = usageReducer({
      failMessage: null,
      showHelpOnFail: true,
      failureOutput: false,
      frozen: {}
    }, setShowHelpOnFail(true, 'This message displays on failure too.'))
    expect(result.failMessage).to.equal('This message displays on failure too.')
    expect(result.showHelpOnFail).to.equal(true)
  })

  it('should enable and set help messaging with two params when state is not explicitly set', () => {
    const result = usageReducer(undefined, setShowHelpOnFail(undefined, 'This message displays on failure too.'))
    expect(result.failMessage).to.equal('This message displays on failure too.')
    expect(result.showHelpOnFail).to.equal(true)
  })

  it('should reset usage', () => {
    const result = usageReducer({
      failMessage: 'Some message',
      showHelpOnFail: false,
      failureOutput: true,
      frozen:
        {test: 'test'}
    }, resetUsage())
    expect(result.failMessage).to.equal(null)
    expect(result.showHelpOnFail).to.equal(true)
    expect(result.failureOutput).to.equal(false)
    expect(JSON.stringify(result.frozen)).to.equal('{"test":"test"}')
  })

  it('should reset usage from initialState', () => {
    const result = usageReducer(undefined, resetUsage())
    expect(result.failMessage).to.equal(null)
    expect(result.showHelpOnFail).to.equal(true)
    expect(result.failureOutput).to.equal(false)
    expect(result).to.have.property('frozen', undefined)
  })

  it('preserves frozen state during reset', () => {
    const initialState = usageReducer(undefined, setShowHelpOnFail('initial'))
    const frozen = usageReducer(initialState, freezeUsage())
    const resetted = usageReducer(frozen, resetUsage())
    const mutated = usageReducer(resetted, setShowHelpOnFail('mutated'))
    const unfrozen = usageReducer(mutated, unfreezeUsage())

    expect(frozen.frozen).to.deep.equal(initialState)
    expect(resetted.frozen).to.deep.equal(frozen.frozen)
    expect(unfrozen).to.deep.equal(initialState)
  })

  it('should set commands', () => {
    const result = usageReducer(undefined, setCommands(['command text']))
    expect(result.commands).to.deep.equal(['command text'])
  })

  it('should add a command to commands', () => {
    const oneCommand = usageReducer(undefined, addCommand('re', 'some description', false, '-p'))
    const twoCommands = usageReducer(oneCommand, addCommand('re other', 'some description for re other', true, '-o'))
    expect(twoCommands.commands).to.deep.equal([['re', 'some description', false, '-p'], ['re other', 'some description for re other', true, '-o']])
  })

  it('should set examples', () => {
    const result = usageReducer(undefined, setExamples(['example text']))
    expect(result.examples).to.deep.equal(['example text'])
  })

  it('should add two examples to examples array', () => {
    const oneExample = usageReducer(undefined, addExample('cmd', 'cmd example text'))
    const twoExamples = usageReducer(oneExample, addExample('another cmd', 'another cmd example text'))
    expect(twoExamples.examples).to.deep.equal([['cmd', 'cmd example text'], ['another cmd', 'another cmd example text']])
  })

  it.only('should set descriptions', () => {
    const result = usageReducer(undefined, setDescriptions({'key': 'key description'}))
    expect(result.descriptions).to.deep.equal({'key': 'key description'})
  })

  it.only('should add two desriptions to descriptions object', () => {
    const oneDescription = usageReducer(undefined, addDescription('key1', 'key1 description'))
    const twoDescriptions = usageReducer(oneDescription, addDescription('key2', 'key2 description'))
    expect(twoDescriptions.descriptions).to.deep.equal({'key1': 'key1 description', 'key2': 'key2 description'})
  })
})
