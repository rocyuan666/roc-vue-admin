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
