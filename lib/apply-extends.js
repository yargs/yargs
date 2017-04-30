var fs = require('fs')
var path = require('path')
var assign = require('./assign')
var YError = require('./yerror')

var previouslyVisitedConfigs = []

function checkForCircularExtends (path) {
  if (previouslyVisitedConfigs.indexOf(path) > -1) {
    throw new YError("Circular extended configurations: '" + path + "'.")
  }

  previouslyVisitedConfigs.push(path)
}

function getPathToDefaultConfig (cwd, pathToExtend) {
  return path.resolve(cwd, pathToExtend)
}

function resetVisitedConfigs () {
  previouslyVisitedConfigs = []
}

function applyExtends (config, cwd) {
  var defaultConfig = {}

  if (config.hasOwnProperty('extends')) {
    var pathToDefault = getPathToDefaultConfig(cwd, config.extends)

    checkForCircularExtends(pathToDefault)

    delete config.extends

    defaultConfig = JSON.parse(fs.readFileSync(pathToDefault, 'utf8'))

    if (config.hasOwnProperty('extendsKey')) {
      defaultConfig = defaultConfig[config.extendsKey] || {}
      delete config.extendsKey
    }

    defaultConfig = applyExtends(defaultConfig, path.dirname(pathToDefault))
  }

  resetVisitedConfigs()

  return assign(defaultConfig, config)
}

module.exports = applyExtends
