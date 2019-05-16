<template>
<div class="page-wrap">
  <div class="index-wrapper">
    <div class="section">
      <div class="section-title">查询台号</div>
      <select @change="selectFn" class="select">
        <option value="请选择" selected disabled>请选择</option>
        <option v-for="(item,i) in barData" :value="item.name" :key="i">{{item.name}}</option>
      </select>
      <div class="init-state">
        <span>{{ selected || '请选择'}}</span>
        <div></div>
      </div>
    </div>
    <div class="bar-wrap">
      <div class="bar-box">
        <div class="bar-list" @click="naToCounter">
          <div class="bar-center"><span>A01</span></div>
          <div class="img-box">
            <img src="../assets/images/touxiang1.jpg" >
            <img src="../assets/images/touxiang2.jpg" >
            <img src="../assets/images/touxiang3.jpg" >
            <img src="../assets/images/touxiang4.jpg" >
            <img src="../assets/images/touxiang5.jpg" >
            <img src="../assets/images/touxiang1.jpg" >
            <img src="../assets/images/touxiang2.jpg" >
            <img src="../assets/images/touxiang3.jpg" >
          </div>
        </div>
        <div class="bar-list" @click="naToCounter">
          <div class="bar-center"><span>A02</span></div>
          <div class="img-box">
            <img src="../assets/images/touxiang1.jpg" >
            <img src="../assets/images/touxiang2.jpg" >
            <img src="../assets/images/touxiang3.jpg" >
            <img src="../assets/images/touxiang4.jpg" >
            <img src="../assets/images/touxiang5.jpg" >
            <img src="../assets/images/touxiang1.jpg" >
            <img src="../assets/images/touxiang2.jpg" >
            <img src="../assets/images/touxiang3.jpg" >
          </div>
        </div>
      </div>
    </div>
    <div id="snowzone">
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
export default {
  components: {bottom},
  data () {
    return {
      selected: '',
      selectedId: '',
      barData: [
        { id: 1, name: '黎明' },
        { id: 2, name: '天黑' },
        { id: 3, name: '须有' }
      ],
      styleArr: []
    }
  },
  methods: {
    selectFn (e) {
      this.selected = e.target.value
      this.selectedId = this.barData[e.target.selectedIndex - 1].id
    },
    naToCounter () {
      this.$router.push({
        path: '/index/counterinfo'
      })
    }
  },
  beforeCreate () {
    document.title = '酒吧'
  },
  mounted () {
    for (let i = 0; i < 10; i++) {
      this.styleArr.push({
        left: Math.random() * window.innerWidth + 'px',
        height: Math.random() * (window.innerHeight + 1 - 200) + 200 + 'px'
      })
    }
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
  background-image: radial-gradient(circle at center top,#f38aee,#00b8ff);
  background-size: cover;
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
      background-image: url(../assets/images/right-icon.png);
      background-size: 100%;
      margin-left: 0.16rem;
    }
  }
}

.bar-box{
  padding: .4rem .2rem;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .bar-list{
    width: 3rem;
    height: 3rem;
    position: relative;
    z-index: 100;
    .bar-center{
      width: 1rem;
      height: 1rem;
      border: 1px solid #ddd;
      border-radius: .5rem;
      position: absolute;
      left: 50%;
      top: 50%;
      z-index: 10000;
      margin-left: -.5rem;
      margin-top: -.5rem;
      font-size: .3rem;
      text-align: center;
      span{
        margin-top: .35rem;
        display: block;
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

#snowzone{
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
