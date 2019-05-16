<template>
  <div class="counter-wrap">
    <mt-header title="A01台号">
      <router-link to="/index" slot="left">
        <mt-button>返回</mt-button>
      </router-link>
    </mt-header>
    <section class="user-wrap">
      <div class="user-box">
        <div class="user-list" @click="toDetail">
          <img src="../../assets/images/touxiang2.jpg" >
          <div>你的小可爱</div>
        </div>
        <div class="user-list" @click="toDetail">
          <img src="../../assets/images/touxiang3.jpg" >
          <div>你的小可爱</div>
        </div>
        <div class="user-list" @click="toDetail">
          <img src="../../assets/images/touxiang4.jpg" >
          <div>你的小可爱</div>
        </div>
        <div class="user-list" @click="toDetail">
          <img src="../../assets/images/touxiang5.jpg" >
          <div>你的小可爱</div>
        </div>
      </div>
    </section>
    <bottom></bottom>
  </div>
</template>

<script>
import bottom from '@/components/bottom'
export default {
  components: {bottom},
  data () {
    return {

    }
  },
  methods: {
    toDetail () {
      this.$router.push({
        path: '/userinfo'
      })
    }
  },
  mounted () {

  }
}
</script>
<style lang="scss">
@import '../../assets/css/my-mint';
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
  .user-box{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
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
