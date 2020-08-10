import { Dictionary, YargsMixin } from '../common-types.js'
import { YError } from '../yerror.js'

let previouslyVisitedConfigs: string[] = []
let mixin: YargsMixin
export function applyExtends (config: Dictionary, cwd: string, mergeExtends: boolean, _mixin: YargsMixin): Dictionary {
  mixin = _mixin
  let defaultConfig = {}

  if (Object.prototype.hasOwnProperty.call(config, 'extends')) {
    if (typeof config.extends !== 'string') return defaultConfig
    const isPath = /\.json|\..*rc$/.test(config.extends)
    let pathToDefault: string | null = null
    if (!isPath) {
      try {
        pathToDefault = require.resolve(config.extends)
      } catch (err) {
        // most likely this simply isn't a module.
      }
    } else {
      pathToDefault = getPathToDefaultConfig(cwd, config.extends)
    }
    // maybe the module uses key for some other reason,
    // err on side of caution.
    if (!pathToDefault && !isPath) return config
    if (!pathToDefault) throw new YError(`Unable to find extended config '${config.extends}' in '${cwd}'.`)

    checkForCircularExtends(pathToDefault)

    previouslyVisitedConfigs.push(pathToDefault)

    defaultConfig = isPath ? JSON.parse(mixin.readFileSync(pathToDefault, 'utf8')) : require(config.extends)
    delete config.extends
    defaultConfig = applyExtends(defaultConfig, mixin.path.dirname(pathToDefault), mergeExtends, mixin)
  }

  previouslyVisitedConfigs = []

  return mergeExtends ? mergeDeep(defaultConfig, config) : Object.assign({}, defaultConfig, config)
}

function checkForCircularExtends (cfgPath: string) {
  if (previouslyVisitedConfigs.indexOf(cfgPath) > -1) {
    throw new YError(`Circular extended configurations: '${cfgPath}'.`)
  }
}

function getPathToDefaultConfig (cwd: string, pathToExtend: string) {
  return mixin.path.resolve(cwd, pathToExtend)
}

function mergeDeep (config1: Dictionary, config2: Dictionary) {
  const target: Dictionary = {}
  function isObject (obj: Dictionary | any): obj is Dictionary {
    return obj && typeof obj === 'object' && !Array.isArray(obj)
  }
  Object.assign(target, config1)
  for (const key of Object.keys(config2)) {
    if (isObject(config2[key]) && isObject(target[key])) {
      target[key] = mergeDeep(config1[key], config2[key])
    } else {
      target[key] = config2[key]
    }
  }
  return target
}
