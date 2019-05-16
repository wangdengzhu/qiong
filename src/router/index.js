import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/index',
    name: 'Index',
    component: () => import('@/view/index'),
    meta: {
      title: '',
      keepAlive: !0
    },
    children: [{
      path: 'counterinfo',
      name: '吧台信息',
      component: () => import('@/view/children/counterinfo'),
      meta: {
        title: ''
      }
    }]
  }, {
    path: '/',
    name: 'Introduce',
    component: () => import('@/view/introduce'),
    meta: {
      title: '介绍',
      keepAlive: !0
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
    name: '聊天列表',
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
    path: '/profile/profile',
    name: '个人中心',
    component: () => import('@/view/profile/profile'),
    meta: {
      title: '个人中心'
    }
  }, {
    path: '/profile/setting',
    name: '修改个人信息',
    component: () => import('@/view/profile/setting'),
    meta: {
      title: '修改个人信息'
    },
    children: [{
      path: '/profile/username',
      name: '修改昵称',
      component: () => import('@/view/profile/username'),
      meta: {
        title: ''
      }
    }]
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
})

router.afterEach((to, from) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  }
})
export default router
