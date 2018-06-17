const { combineReducers } = require('redux')
const middlewareReducer = require('../reducers/middleware')
const contextReducer = require('../reducers/context')
const usageReducer = require('../reducers/usage')

module.exports = combineReducers({
  middleware: middlewareReducer,
  context: contextReducer,
  usage: usageReducer
})
