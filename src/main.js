import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui' // element-ui的全部组件
import 'element-ui/lib/theme-chalk/index.css'// element-ui的css
// import qs from 'qs'
// import axios from 'axios'

Vue.use(ElementUI) // 使用elementUI
// Vue.prototype.$qs = qs
// Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  // qs,
  // axios,
  render: h => h(App)
})
// router.beforeEach((to, from, next) => {
//   let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
//   console.log('userInfo', userInfo)
//   if (!userInfo && userInfo.access_token) {
//     next()
//   } else {
//     console.log('userInfo', userInfo)
//     next('/login')
//   }
// })
