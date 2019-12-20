import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器的样式

// 导入 NProgress 包对应的JS和CSS
import NProgress from 'nprogress'

import axios from 'axios'
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 在request请求拦截器，展示进度条 Nprogress.start()
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须 return config
  return config
})
// 在response响应拦截器，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  // 最后必须 return config
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)
Vue.component('tree-table', TreeTable)
// 时间过滤器
Vue.filter('dateFormat', function (val) {
  const dt = new Date(val)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const h = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const s = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${mm}:${s}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
