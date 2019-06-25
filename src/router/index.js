import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/start',
    name: '中转页面',
    component: () => import('@/view/start'),
    meta: {
      title: ''
    }
  }, {
    path: '/index',
    name: '大厅',
    component: () => import('@/view/index'),
    meta: {
      title: '',
      keepAlive: !0
    }
  }, {
    path: '/introduce',
    name: '介绍',
    component: () => import('@/view/introduce'),
    meta: {
      title: ''
    }
  }, {
    path: '/counterinfo',
    name: 'counterinfo',
    component: () => import('@/view/counterinfo'),
    meta: {
      title: '吧台信息'
    }
  }, {
    path: '/user',
    name: '初始化个人中心',
    component: () => import('@/view/user'),
    meta: {
      title: '个人中心',
      keepAlive: !0
    }
  }, {
    path: '/userinfo',
    name: '个人信息',
    component: () => import('@/view/userinfo'),
    meta: {
      title: ''
    }
  }, {
    path: '/greet',
    name: '打招呼',
    component: () => import('@/view/greet'),
    meta: {
      title: ''
    }
  }, {
    path: '/chatlist',
    name: '消息列表',
    component: () => import('@/view/chatlist'),
    meta: {
      title: '消息'
    }
  }, {
    path: '/chat',
    name: '聊天界面',
    component: () => import('@/view/chat'),
    meta: {
      title: ''
    }
  }, {
    path: '/message',
    name: '留言板',
    component: () => import('@/view/message'),
    meta: {
      title: ''
    }
  }, {
    path: '/profile/profile',
    name: '我的',
    component: () => import('@/view/profile/profile'),
    meta: {
      title: '个人中心'
    },
    children: [
      {
        path: '/profile/username',
        name: '修改昵称',
        component: () => import('@/view/profile/username'),
        meta: {
          title: ''
        }
      },
      {
        path: '/profile/signature',
        name: '修改个性签名',
        component: () => import('@/view/profile/signature'),
        meta: {
          title: ''
        }
      },
      {
        path: '/profile/hobby',
        name: '修改个人标签',
        component: () => import('@/view/profile/hobby'),
        meta: {
          title: '修改个人标签'
        }
      }
    ]
  }, {
    path: '/mygift',
    name: '我的礼物',
    component: () => import('@/view/mygift'),
    meta: {
      title: '我的礼物'
    }
  }, {
    path: '/cash',
    name: '提现',
    component: () => import('@/view/cash'),
    meta: {
      title: '提现'
    }
  }, {
    path: '/feedback',
    name: '意见反馈',
    component: () => import('@/view/feedback'),
    meta: {
      title: '意见反馈'
    }
  }, {
    path: '/order/orderdetail',
    name: '订单详情',
    component: () => import('@/view/order/orderdetail'),
    meta: {
      title: '订单详情'
    }
  }, {
    path: '/order/refund',
    name: '申请退款',
    component: () => import('@/view/order/refund'),
    meta: {
      title: '申请退款'
    }
  }],
  mode: 'history'
  // base: '/'
})

// router.beforeEach((to, from, next) => {
//   /* 路由发生变化修改页面title */
//   document.title = to.meta.title
//   // 第一次访问
//   const token = window.localStorage.getItem('token')
// debugger
//   if (!token && to.path !== '/') {
//     // 保存用户进入的url
//     console.log(to.fullPath)
//     window.localStorage.setItem('beforeLoginUrl', to.fullPath)
//     next('/')
//   } else if (token && !store.getters.userInfo) {
//     // 拉取用户信息
//     store.dispatch('getUserInfo').catch(err => {
//       console.log(err)
//       window.localStorage.removeItem('token')
//       router.go(0)
//     })
//     next()
//   } else {
//     // 已经登录
//     next()
//   }
// })

router.afterEach((to, from) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  }
})
export default router
