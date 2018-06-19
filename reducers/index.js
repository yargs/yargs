const { combineReducers } = require('redux')
const middlewareReducer = require('../reducers/middleware')
const usageReducer = require('../reducers/usage')

module.exports = combineReducers({
  middleware: middlewareReducer,
  usage: usageReducer
})
