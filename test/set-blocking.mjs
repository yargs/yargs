'use strict';
/* global describe, it */

import assert from 'assert';
import setBlocking from '../build/lib/utils/set-blocking.js';

describe('setBlocking', () => {
  it('sets blocking mode for non-TTY streams with writable handles', () => {
    const stdout = Object.getOwnPropertyDescriptor(process, 'stdout');
    const stderr = Object.getOwnPropertyDescriptor(process, 'stderr');
    const calls = [];

    Object.defineProperty(process, 'stdout', {
      configurable: true,
      value: {
        isTTY: false,
        _handle: {
          setBlocking: value => calls.push(['stdout', value]),
        },
      },
    });
    Object.defineProperty(process, 'stderr', {
      configurable: true,
      value: {
        isTTY: false,
        _handle: {
          setBlocking: value => calls.push(['stderr', value]),
        },
      },
    });

    try {
      setBlocking(true);
      assert.deepStrictEqual(calls, [
        ['stdout', true],
        ['stderr', true],
      ]);
    } finally {
      Object.defineProperty(process, 'stdout', stdout);
      Object.defineProperty(process, 'stderr', stderr);
    }
  });
});
