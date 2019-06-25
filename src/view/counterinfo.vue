<template>
  <div class="counter-wrap">
    <mt-header :title="title">
      <router-link to="/index" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <section class="user-wrap">
      <div class="user-box">
        <div class="user-list" @click="toDetail(item.id)" v-for="(item, i) in users" :key="i">
          <img :src="item.avatar" >
          <div>{{item.nickname}}</div>
        </div>
      </div>
    </section>
    <bottom></bottom>
  </div>
</template>

<script>
import bottom from '@/components/bottom'
import { Indicator, Toast } from 'mint-ui'
export default {
  components: {bottom},
  data () {
    return {
      title: '',
      tabNum: '',
      users: []
    }
  },
  methods: {
    toDetail (id, tabNum) {
      this.$router.push({
        path: '/userinfo',
        query: {
          id,
          tabNum: this.tabNum
        }
      })
    }
  },
  mounted () {
    this.tabNum = this.$route.query.tabNum
    let mchId = this.$route.query.mchId
    this.title = this.tabNum + '台'
    Indicator.open()
    let token = localStorage.getItem('token')
    this.$get(`/mch/tab/${mchId}/${this.tabNum}/onlineUser`, {'APP-Token': token}).then(res => {
      Indicator.close()
      if (res.ret === 0) {
        this.users = res.data
      }
    })
  }
}
</script>
<style lang="scss">
@import '../assets/css/my-mint';
.counter-wrap{
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: #fff;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1111;
}
.user-wrap{
  padding-top: .4rem;
  padding-bottom: 1.4rem;
  font-size: .3rem;
  .user-box{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .user-list{
      margin: .2rem;
      width: 3rem;
      text-align: center;
      img{
        width: 2rem;
        height: 2rem;
        margin-bottom: .2rem;
      }
    }
  }
}
</style>
