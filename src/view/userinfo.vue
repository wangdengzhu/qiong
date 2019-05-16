<template>
  <div class="counter-wrap" @click="showGreet = !1">
    <section class="user-wrap1">
      <div class="user-box1">
        <img @click="preImage($event)" src="../assets/images/touxiang2.jpg" >
        <p>昵称：A01台 你的小可爱</p>
      </div>
      <div class="user-box2">
        <p>个性签名：</p>
         要不要一起来玩？
      </div>
      <div class="user-box3">
        <div @click="receive">查看收到的招呼￥20</div>
        <div @click="receive">查看打出的招呼￥20</div>
      </div>
      <div class="user-box4">
        <p>TA的标签：</p>
        <div class="biaoqian">
          <span>电影</span>
          <span>电影借</span>
          <span>电影好看</span>
          <span>电影</span>
          <span>电影借</span>
          <span>电影好看</span>
          <span>电影</span>
        </div>
      </div>
    </section>
    <div>
      <transition name="slideup">
        <div class="greet" v-show="showGreet" ref="greet"  @click.stop="showGreet = !0">
          <div class="send-list large" @click="sendGift(1)">
            <img src="../assets/images/handshake.png" >
            <p>握手</p>
          </div>
          <div class="send-list large" @click="sendGift(2)">
            <img src="../assets/images/smile.png" >
            <p>微笑</p>
          </div>
          <div class="send-list large" @click="sendGift(3)">
            <img src="../assets/images/rose.png" >
            <p>1朵玫瑰￥20</p>
          </div>
          <div class="send-list" @click="sendGift(4)">
            <img src="../assets/images/rose.png" >
            <p>1束玫瑰￥52</p>
          </div>
          <div class="send-list" @click="sendGift(5)">
            <img src="../assets/images/rose.png" >
            <p>999朵玫瑰￥520</p>
          </div>
        </div>
      </transition>

      <div class="bottom">
        <mt-button size="large" type="primary" @click.native.stop="showGreet = !0">打招呼</mt-button>
      </div>
    </div>
    <div class="preview" v-show="isShow" @click="hidePreview">
      <div class="preview__bg"></div>
      <div class="preview__pic" >
        <img ref="preview" src="" alt="">
        <div v-show="preImgIsLoading" class="preview__loading"></div>
      </div>
    </div>
  </div>
</template>

<script>

import { Indicator, Toast } from 'mint-ui'
export default {
  data () {
    return {
      isShow: !1,
      preImgIsLoading: !0,

      showGreet: !1,
      im: null
    }
  },
  methods: {
    toDetail () {
      this.$router.push({
        path: '/index'
      })
    },
    receive () {
      this.$router.push({
        path: '/greet'
      })
    },
    greet () {
      this.showGreet = !0
    },
    preImage (event) {
      this.isShow = !0
      let imgUrl = event.target.src
      this.$refs.preview.src = imgUrl
      this.preImgIsLoading = !0
      const image = new Image()
      image.onload = () => {
        this.preImgIsLoading = !1
        this.$refs.preview.src = imgUrl
      }

      image.src = imgUrl
    },
    hidePreview () {
      this.$refs.preview.style.transform = 'scale3d(1, 1, 1)'
      this.isShow = !1
    },
    sendGift (type) {
      Toast('送出礼物成功！')
      this.$router.push({
        path: '/chat'
      })
    }
  },
  created () {

  }
}
</script>
<style lang="scss">
.counter-wrap{
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: #fff;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
}
.user-wrap1{
  padding: .4rem 0;
  margin-bottom: 1.2rem;
  font-size: .3rem;
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
    box-sizing: border-box;
    width: 7.1rem;
    margin: auto;
    padding: .5rem .2rem;
    border: 1px solid #ddd;
    border-radius: .08rem;
    p{
      margin: 0 0 .5rem;
      padding-left: .42rem;
      background: url(../assets/images/label-icon.png) left center no-repeat;
      background-size: contain;
    }
  }
  .user-box3{
    margin: .3rem auto;
    width: 7.1rem;
    display: flex;
    justify-content: space-between;
    div{
      width: 3.4rem;
      height: 1rem;
      text-align: center;
      line-height: 1rem;
      background: #ffc8fc;
      color: #f00;
      border-radius: .08rem;
    }
  }
  .user-box4{
    margin: auto;
    padding: .4rem .1rem;
    width: 7.1rem;
    box-sizing: border-box;
    border: 1px solid #ddd;
    border-radius: .08rem;
    p{
      margin: 0 0 .3rem;
      padding-left: .42rem;
      background: url(../assets/images/love-icon.png) left center no-repeat;
      background-size: contain;
    }
    .biaoqian{
      display: flex;
      flex-wrap: wrap;
      padding: 0 .1rem;
      span{
        padding: .13rem .2rem;
        margin: .2rem;
        background: #ffc626;
        border-radius: .08rem;
        font-size: .26rem;
      }
    }
  }
}
.greet{
  position: fixed;
  left: 0;
  bottom: 1.2rem;
  width: 6.3rem;
  padding: .2rem .6rem;
  border-top: 1px solid #ddd;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  background: #fff;
  .send-list{
    margin: .2rem;
    text-align: center;
    font-size: .22rem;
    img{
      width: .5rem;
      height: .5rem;
    }
  }
  .large{
    margin-right: .5rem;
    margin-left: .5rem;
  }
}
.bottom{
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 9;
  padding: .2rem;
  width: 7.1rem;
  background: #fff;
  button{
    height: .8rem;
  }
}
.slideup-enter-active,.slideup-leave-active{
    transition: all .3s ease-in-out;
}
.slideup-enter,.slideup-leave-to{
    transform: translate3d(0,100%,0);
}

.preview{
  .preview__bg{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 1);
    color: #fff;
    z-index: 99;
  }
  .preview__pic{
    position: fixed;
    top: 50%;
    left: 50%;

    width: 100%;
    transform: translate3d(-50%, -50%, 0);
    z-index: 100;

    img{
      display: block;
      width: 100%;
      transform: scale(1);
      transition: transform .2s linear;
    }

    .preview__loading{
      position: absolute;
      top: 50%;
      left: 50%;

      width: 0.4rem;
      height: 0.4rem;

      margin-left: -0.2rem;
      margin-top: -0.2rem;

      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D'0%200%20120%20120'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20xmlns%3Axlink%3D'http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink'%3E%3Cdefs%3E%3Cline%20id%3D'l'%20x1%3D'60'%20x2%3D'60'%20y1%3D'7'%20y2%3D'27'%20stroke%3D'%236c6c6c'%20stroke-width%3D'11'%20stroke-linecap%3D'round'%2F%3E%3C%2Fdefs%3E%3Cg%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(30%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(60%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(90%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(120%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(150%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.37'%20transform%3D'rotate(180%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.46'%20transform%3D'rotate(210%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.56'%20transform%3D'rotate(240%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.66'%20transform%3D'rotate(270%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.75'%20transform%3D'rotate(300%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.85'%20transform%3D'rotate(330%2060%2C60)'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E");

      background-position: 0 0;
      background-size: contain;
      background-repeat: no-repeat;

      animation: spin 1s steps(12, end) infinite;
    }
  }
}
</style>
