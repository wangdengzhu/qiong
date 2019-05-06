import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/view/index';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/index',
      name: 'Index',
      component: Index
    }
  ],
  mode: 'history'
})
