import {Dictionary, PlatformShim} from '../typings/common-types.js';
import {YError} from '../yerror.js';

let previouslyVisitedConfigs: string[] = [];
let shim: PlatformShim;
export function applyExtends(
  config: Dictionary,
  cwd: string,
  mergeExtends: boolean,
  _shim: PlatformShim
): Dictionary {
  shim = _shim;
  let defaultConfig = {};

  if (Object.prototype.hasOwnProperty.call(config, 'extends')) {
    if (typeof config.extends !== 'string') return defaultConfig;
    const isPath = /\.json|\..*rc$/.test(config.extends);
    let pathToDefault: string | null = null;
    if (!isPath) {
      try {
        pathToDefault = import.meta.resolve(config.extends);
      } catch (_err) {
        // maybe the module uses key for some other reason,
        // err on side of caution.
        return config;
      }
    } else {
      pathToDefault = getPathToDefaultConfig(cwd, config.extends);
    }

    checkForCircularExtends(pathToDefault);

    previouslyVisitedConfigs.push(pathToDefault);

    defaultConfig = isPath
      ? JSON.parse(shim.readFileSync(pathToDefault, 'utf8'))
      : _shim.require(config.extends);
    delete config.extends;
    defaultConfig = applyExtends(
      defaultConfig,
      shim.path.dirname(pathToDefault),
      mergeExtends,
      shim
    );
  }

  previouslyVisitedConfigs = [];

  return mergeExtends
    ? mergeDeep(defaultConfig, config)
    : Object.assign({}, defaultConfig, config);
}

function checkForCircularExtends(cfgPath: string) {
  if (previouslyVisitedConfigs.indexOf(cfgPath) > -1) {
    throw new YError(`Circular extended configurations: '${cfgPath}'.`);
  }
}

function getPathToDefaultConfig(cwd: string, pathToExtend: string) {
  return shim.path.resolve(cwd, pathToExtend);
}

function mergeDeep(config1: Dictionary, config2: Dictionary) {
  const target: Dictionary = {};
  function isObject(obj: Dictionary | any): obj is Dictionary {
    return obj && typeof obj === 'object' && !Array.isArray(obj);
  }
  Object.assign(target, config1);
  for (const key of Object.keys(config2)) {
    if (key === '__proto__') continue;
    if (isObject(config2[key]) && isObject(target[key])) {
      target[key] = mergeDeep(config1[key], config2[key]);
    } else {
      target[key] = config2[key];
    }
  }
  return target;
}
