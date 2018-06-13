const { createStore } = require('redux')
const middlewareReducer = require('../reducers/middleware')

const store = createStore(middlewareReducer)

module.exports = store
