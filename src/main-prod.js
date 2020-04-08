import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
// import './plugins/element-ui.js'
// 导入富文本编辑器
// import VueQuillEditor from 'vue-quill-editor'
// 注册
Vue.use(VueQuillEditor)
// 导入富文本编辑器样式
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

// 导入进度条样式
// import 'nprogress/nprogress.css'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
