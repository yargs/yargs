const {createStore} = require('redux')
const rootReducer = require('../reducers')

const store = createStore(rootReducer)

module.exports = store
