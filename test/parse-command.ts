/* global describe, it */
import { expect } from 'chai'
import { parseCommand } from '../lib/parse-command'

describe('parseCommand', () => {
  it('should throw if no command is specified', () => {
    expect(() => parseCommand('')).to.throw('No command found in: ')
  })
})
