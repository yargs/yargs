/* global Deno */

import {assertEquals} from 'https://deno.land/std/testing/asserts.ts';
import shim from '../../lib/platform-shims/deno.ts';

// y18n.
Deno.test('__ behaves like sprintf', () => {
  const str = shim.y18n.__('hello %s, goodnight %s', 'world', 'moon');
  assertEquals(str, 'hello world, goodnight moon');
});

Deno.test('__n uses first string if singular', () => {
  const str = shim.y18n.__n(
    'Missing required argument: %s',
    'Missing required arguments: %s',
    1,
    'foo, bar'
  );
  assertEquals(str, 'Missing required argument: foo, bar');
});

Deno.test('__n uses second string if plural', () => {
  const str = shim.y18n.__n(
    'Missing required argument: %s',
    'Missing required arguments: %s',
    2,
    'foo, bar'
  );
  assertEquals(str, 'Missing required arguments: foo, bar');
});
