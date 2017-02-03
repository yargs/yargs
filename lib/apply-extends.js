var fs = require('fs')
var path = require('path')
var assign = require('./assign')

function applyExtends (config, cwd) {
  var defaultConfig = {}

  if (config.hasOwnProperty('extends')) {
    var pathToDefault = path.join(cwd, config.extends)
    delete config.extends

    defaultConfig = JSON.parse(fs.readFileSync(pathToDefault, 'utf8'))
    defaultConfig = applyExtends(defaultConfig, path.dirname(pathToDefault))
  }

  return assign(defaultConfig, config)
}

module.exports = applyExtends
