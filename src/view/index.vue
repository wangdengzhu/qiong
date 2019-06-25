<template>
<div class="page-wrap">
  <div class="index-wrapper">
    <div class="title">{{barInfo.bar && barInfo.bar.name}}</div>
    <div class="section">
      <div class="section-title">想找的人在几号台？</div>
      <select @change="selectFn" class="select">
        <option value="" selected disabled>选择台号</option>
        <option v-for="(item,i) in tabNumList" :value="item" :key="i">{{item}}</option>
      </select>
      <div class="init-state">
        <span>{{ selected || '选择台号'}}</span>
        <div></div>
      </div>
    </div>
    <div class="bar-wrap">
      <div class="bar-box">
        <div class="bar-list" @click="naToCounter(item)" v-for="(item, i) in barData" :key="i">
          <div class="bar-center"><span>{{item.tabNum}}</span><p>...</p></div>
          <div class="img-box">
            <img :src="v.avatar" v-for="(v, n) in item.users" :key="n">
          </div>
        </div>
      </div>
    </div>
    <div class="snowzone">
      <div class="div" v-for="(n, i) in 10" :key="i" :style="styleArr[i]">
        <img class="roll" :class="'roll-' + i" src="../assets/images/love-1.png" >
      </div>
    </div>
    <bottom></bottom>
  </div>
  <transition name="slide">
    <router-view></router-view>
  </transition>
</div>
</template>

<script>
import bottom from '@/components/bottom'
import store from '@/store/'
import { mapState, mapMutations } from 'vuex'
import { Indicator, Toast } from 'mint-ui'

export default {
  components: {bottom},
  data () {
    return {
      selected: '',
      barData: [],
      tabNumList: [],
      styleArr: [],
      token: ''
    }
  },
  methods: {
    ...mapMutations(['SAVE_USERINFO', 'SAVE_BARINFO']),
    selectFn (e) {
      this.selected = e.target.value
      Indicator.open()
      this.$get('/mch/tab/all', {tabNum: this.selected, 'APP-Token': this.token}).then(res => {
        Indicator.close()
        if (res.ret === 0) {
          this.barData = res.data.records
        }
      })
    },
    naToCounter (item) {
      if (item.users.length <= 0) {
        Toast('该吧台没人入座')
        return
      }
      const {tabNum, mchId} = item
      this.$router.push({
        path: '/counterinfo',
        query: {
          tabNum,
          mchId
        }
      })
    },
    getUser () {
      // 获取本人用户信息
      this.$get('/user/myInfo', {'APP-Token': this.token}).then(res => {
        if (res.ret === 0) {
          store.commit('SAVE_USERINFO', res.data.baseInfo)
          store.commit('SAVE_COUNTINFO', res.data.account)
        }
      })
    }
  },
  computed: {
    ...mapState({
      barInfo: state => state.user.barInfo
    })
  },
  mounted () {
    for (let i = 0; i < 10; i++) {
      this.styleArr.push({
        left: Math.random() * window.innerWidth + 'px',
        height: Math.random() * (window.innerHeight + 1 - 200) + 200 + 'px'
      })
    }
    Indicator.open()
    // 获取吧台信息，入座人信息
    this.$get('/mch/tab/all').then(res => {
      Indicator.close()
      if (res.ret === 0) {
        this.barData = res.data.records
        this.barData.map(item => {
          this.tabNumList.push(item.tabNum)
        })
      }
    })
    // 获取酒吧信息
    this.$get('/mch/current').then(res => {
      Indicator.close()
      if (res.ret === 0) {
        localStorage.setItem('token', res.data.token)
        this.token = res.data.token
        store.commit('SAVE_BARINFO', res.data)
        this.getUser()
      } else {
        store.commit('SAVE_BARINFO', {})
      }
    })
  }
}
</script>
<style scoped lang="scss">
.page-wrap {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 1;
  background-color: #fff;
  color: #333;
  font-size: 0.32rem;
  overflow: hidden;
}
.index-wrapper{
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
  overflow: auto;
  background: #cc6172;
}
.title{
  text-align: center;
  line-height: .8rem;
  border-bottom: 1px solid #fff;
}
.section {
  padding: 0 .32rem;
  position: relative;
  z-index: 1000;
  height: 0.88rem;
  border-bottom: 0.02rem solid #e5e5e5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .section-title,
  .section-val {
    font-size: 0.28rem;
    color: #333;
  }
  .select {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    color: #fff;
    option{
      color: #fff;
    }
  }
  .init-state{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 0.26rem;
    color: #333;
    line-height: 0.88rem;
      div {
      width: 0.14rem;
      height: 0.24rem;
      background-image: url(../assets/images/list-icon.png);
      background-size: 100%;
      margin-left: 0.16rem;
    }
  }
}

.bar-box{
  padding: .4rem;
  padding-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .bar-list{
    width: 3rem;
    height: 3rem;
    margin-bottom: .6rem;
    position: relative;
    z-index: 100;
    .bar-center{
      width: 1rem;
      height: 1rem;
      border-radius: .5rem;
      position: absolute;
      left: 50%;
      top: 50%;
      z-index: 10000;
      margin-left: -.5rem;
      margin-top: -.7rem;
      font-size: .3rem;
      text-align: center;
      color: #fff;
      span{
        margin-top: .35rem;
        display: block;
      }
      p{
        font-size: .4rem;
      }
    }
    .img-box{
      width: 3rem;
      height: 3rem;
      position: relative;
    }
    img{
      width: .6rem;
      height: .6rem;
      border: 1px solid #ddd;
      border-radius: .3rem;
      position: absolute;
      &:first-child{
        top: .1rem;
        left: 1.2rem;
      }
      &:nth-child(2){
        top: .35rem;
        left: 2rem;
      }
      &:nth-child(3){
        top: .35rem;
        left: .35rem;
      }
      &:nth-child(4){
        top: 1.15rem;
        left: 2.3rem;
      }
      &:nth-child(5){
        top: 1.15rem;
        left: .1rem;
      }
      &:nth-child(6){
        top: 2rem;
        left: 2rem;
      }
      &:nth-child(7){
        top: 2rem;
        left: .35rem;
      }
      &:nth-child(8){
        bottom: .1rem;
        left: 1.2rem;
      }
    }
  }
}
.slide-enter-active,.slide-leave-active{
  transition: all .3s ease-in-out;
}
.slide-enter,.slide-leave-to{
  transform: translate3d(100%,0,0);
}

.snowzone{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}
@keyframes mysnow {
  0% {
    bottom: 100%;
    opacity: 0;
  }
  50% {
    opacity: 1;
    transform: rotate(1080deg);
  }
  99% {
    transform: rotate(0deg);
    opacity: 0;
    bottom: 0;
  }
  100% {
    bottom: 100%;
    opacity: 0;
  }
}

.roll {
  position: absolute;
  opacity: 0;
  animation: mysnow 10s infinite;
  width: 18px;
  // height: 16px;
}
.roll-1{
  animation-delay: 1s;
}
.roll-2{
  animation-delay: 2s;
}
.roll-3{
  animation-delay: 3s;
}
.roll-4{
  animation-delay: 4s;
}
.roll-5{
  animation-delay: 5s;
}
.roll-6{
  animation-delay: 6s;
}
.roll-7{
  animation-delay: 7s;
}
.roll-8{
  animation-delay: 8s;
}
.roll-9{
  animation-delay: 9s;
}
.roll-10{
  animation-delay: 10s;
}
.div {
  position: fixed;
}

</style>
