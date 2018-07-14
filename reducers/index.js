const { combineReducers } = require('redux')
const middlewareReducer = require('./middleware')
const usageReducer = require('./usage')
const commandReducer = require('./command')

module.exports = combineReducers({
  middleware: middlewareReducer,
  usage: usageReducer,
  command: commandReducer
})
