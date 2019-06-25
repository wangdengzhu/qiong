// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import FastClick from 'fastclick'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/my-mint.css'
import './utils/rem'
import { fetch, post } from './utils/fetch'
import VueJsonp from 'vue-jsonp'

Vue.use(VueJsonp)
Vue.use(MintUI)
Vue.use(ElementUI)
Vue.config.productionTip = false

Vue.prototype.$post = post // post方法
Vue.prototype.$get = fetch // fetch方法

Vue.prototype.$store = store

document.addEventListener('DOMContentLoaded', () => {
  FastClick.attach(document.body)
}, !1)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
