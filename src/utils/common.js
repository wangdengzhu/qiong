// 去抖函数，防止某些操作太频繁操作
export const throttle = (method, duration, delay) => {
  var timerID = null,
    begin = +new Date(),
    isFirstCall = !0

  return function () {
    var args = arguments,
      ctx = this,
      now = +new Date()
    if (isFirstCall) {
      method.apply(ctx, args)
      begin = now
      isFirstCall = !1
      return
    }
    if (timerID) {
      clearTimeout(timerID)
    }
    if (now - begin > duration) {
      method.apply(ctx, args)
      begin = now
    } else {
      timerID = setTimeout(function () {
        method.apply(ctx, args)
      }, delay)
    }
  }
}

// 检测浏览器是否开启本地存储
export const storageSupportTest = () => {
  let isSupport = !0
  const key = 'test'
  try {
    localStorage.setItem(key, 'hello')
    localStorage.removeItem(key)
  } catch (e) {
    isSupport = !1
  }

  if (!isSupport) {
    alert('您的浏览器处于隐私模式，请关闭哦!否则将无法加购物车哦!')
  }
}

// 判断是否微信环境
export const isWXBrowser = (() => {
  const ua = window.navigator.userAgent.toLowerCase()
  return /(micromessenger|webbrowser)/g.test(ua)
})()

// 获取查询字符串参数
export const getQueryParam = (dataStr) => {
  return function (name) {
    const res = dataStr.match(new RegExp(name + '=([^&]*)'))
    return res ? res[1] : null
  }
}

export const queryParams = (data, isPrefix = false) => {
  let prefix = isPrefix ? '?' : ''
  let _result = []
  for (let key in data) {
    let value = data[key]
    // 去掉为空的参数
    if (['', undefined, null].includes(value)) {
      continue
    }
    if (value.constructor === Array) {
      value.forEach(_value => {
        _result.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(_value))
      })
    } else {
      _result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
    }
  }

  return _result.length ? prefix + _result.join('&') : ''
}

export const getParams = (data) => {
  let _result = []
  for (let key in data) {
    let value = data[key]
    // 去掉为空的参数
    if (['', undefined, null].includes(value)) {
      continue
    }
    _result.push(key + '=' + value)
    // if (value.constructor === Array) {
    //   value.forEach(_value => {
    //     _result.push(key + '[]=' + _value)
    //   })
    // } else {
    //   _result.push(key + '=' + value)
    // }
  }

  return _result.length ? _result.join('&') : ''
}
