/**
 * 基于axios封装网络请求接口,支持GET,POST请求
 */

import Vue from 'vue'
import router from '@/router'
import axios from 'axios'
import { Indicator, Toast } from 'mint-ui'

// API基础URL
axios.defaults.baseURL = 'http://webapi.hnjmnet.com/api/'
// axios.defaults.baseURL = 'http://vin.free.idcfengye.com/api/'
// 请求超时时间
axios.defaults.timeout = 30000
axios.defaults.withCredentials = true

// 设置HTTP请求的拦截器
axios.interceptors.request.use((config) => {
  // const { token, shopId, sharesource, openid } = store.state
  // const token = storage.get('token')
  // http://47.110.155.113/api/auth/loginByPhone?phone=13648394014&nsukey=FGmyqyCuGpWYaxzawP%2Fh06LTQR2gMWF5%2BopgSQ7iHPy1UcXyXpLHPSXaRtfEkTV1sCrzGwaxfNfmx0oSqa4RI0ZDHsamz4%2F9RfLs4SHhpU%2B6%2FX4K3Vx6X8ILYqCpTgbI5xWAy4zHOnxT9PfUO7JUIkvX1DQ6ExgjZkdt79s9ubpixnA7kvbxt5GuoKTFcTpn
  // const token = '7679ee4d-d459-48ff-a099-3b03c2af68ea'
  // const token = '8659f802-b012-49eb-8094-8566c50c22b1'
  const token = localStorage.getItem('token')
  const openId = localStorage.getItem('openId')
  // const openId = storage.get('openId')
  if (token) {
    config.headers['APP-Token'] = token
  }
  if (openId) {
    config.headers.openId = openId
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// 设置HTTP响应的拦截器
axios.interceptors.response.use((response) => {
  const code = response.data.code
  if (code === 401) {
    // 对特定返回码进行预处理，比如需要登录等.
    if (router.currentRoute.meta.requireAuth) {
      Vue.prototype.loginCfg.cb = () => {
        router.go(0)
      }
      Toast('登录已失效，请重新登录!')
    }
    // return Promise.reject('401')
  } else if (code === 404) {
    router.push({
      path: '404'
    })
  }
  return response
}, (error) => {
  Indicator.close()
  Toast('网络不给力，请稍后重试!')
  return Promise.reject(error)
})

// GET请求使用方法
export function fetch (url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {params})
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

// POST请求使用方法
export function post (url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
