<template>
  <div class="profile-wrap" @click="showGreet = !1">
    <section class="user-con">
      <div class="user-box1">
        <router-link :to="{path: '/profile/setting', query: { shopId: 1}}">
          <img src="../../assets/images/touxiang2.jpg" >
          <p>昵称：A01台 你的小可爱</p>
        </router-link>
      </div>
      <div class="ht20"></div>
      <div class="user-box2">
        <p>个性签名：</p>
         要不要一起来玩？
      </div>
      <div class="ht20"></div>
      <div class="list-box" @click="toMyGift">
        <div class="gift">我的礼物</div>
      </div>
      <div class="ht20"></div>
      <div class="list-box" @click="toFeedback">
        <div class="sugest">意见反馈</div>
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
      isShow: !1,
      preImgIsLoading: !0,

      showGreet: !1,
      im: null
    }
  },
  methods: {
    toMyGift () {
      this.$router.push({
        path: '/mygift'
      })
    },
    toFeedback () {
      this.$router.push({
        path: '/feedback'
      })
    }
  },
  created () {

  }
}
</script>
<style lang="scss">
.profile-wrap{
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: #f0f0f0;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
}
.user-con{
  padding: .4rem 0 0;
  margin-bottom: 1.2rem;
  font-size: .3rem;
  background-color: #fff;
  .user-box1{
    width: 7.3rem;
    padding: .4rem 0 .6rem;
    text-align: center;
    img{
      width: 2rem;
      height: 2rem;
      margin-bottom: .2rem;
    }
  }
  .user-box2{
    width: 7.1rem;
    margin: auto;
    padding: .5rem .2rem;
    p{
      margin: 0 0 .5rem;
      padding-left: .42rem;
      background: url(../../assets/images/label-icon.png) left center no-repeat;
      background-size: contain;
    }
  }
  .list-box{
    margin-right: .2rem;
    padding: .4rem .2rem;
    background: url(../../assets/images/list-icon.png) right center no-repeat;
    background-size: .32rem .52rem;
    div{
      padding-left: .5rem;
    }
    .gift{
      background: url(../../assets/images/gift-icon.png) left center no-repeat;
      background-size: .45rem;
    }
    .sugest{
      background: url(../../assets/images/sugest-icon.png) left center no-repeat;
      background-size: .45rem;
    }
  }
}

</style>
