// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import FastClick from 'fastclick'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/my-mint.css'
import './utils/rem'
Vue.use(MintUI)
Vue.use(ElementUI)
Vue.config.productionTip = false

document.addEventListener('DOMContentLoaded', () => {
  FastClick.attach(document.body)
}, !1)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
