import { MainType, RequireType } from '../common-types.js'

export default function requireMainFilename (_require: RequireType) {
  _require = _require || require
  var main = _require.main
  if (main && isIISNode(main)) return handleIISNode(main)
  else return main ? main.filename : process.cwd()
}

function isIISNode (main: MainType) {
  return /\\iisnode\\/.test(main.filename)
}

function handleIISNode (main: MainType) {
  if (!main.children.length) {
    return main.filename
  } else {
    return main.children[0].filename
  }
}
