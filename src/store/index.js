// import Vue from 'vue'
// import Vuex from 'vuex'
// import getters from './getters'
// import app from './modules/app'
// import permission from './modules/permission'
// import settings from './modules/settings'
// import user from './modules/user'

// Vue.use(Vuex)

// const store = new Vuex.Store({
//   modules: {
//     app,
//     permission,
//     settings,
//     user
//   },
//   getters
// })

// export default store

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const modules = {}
const files = require.context('./modules', false, /\.js$/)
files.keys().forEach((path) => {
  modules[path.replace(/(modules|\/|\.|js)/g, '')] = {
    ...files(path).default,
    namespaced: true
  }
})

const store = new Vuex.Store({
  modules
})
export default store
