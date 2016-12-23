#!/usr/bin/env node
function load (path) {
  console.warn('warning: %s not found', path)
  return {}
}

require('../../index.js')
.config('config', load)
.global('config')
.command('command')
.argv

