<template>
  <div class="counter-wrap" @click="showGreet = !1" v-cloak>
    <section class="user-wrap1">
      <mt-header :title="title">
        <div @click="$router.go(-1)" slot="left">
          <mt-button icon="back"></mt-button>
        </div>
      </mt-header>
      <div class="user-box1">
        <img @click="preImage($event)" :src="userInfoData.avatar" >
        <p>{{userInfoData.nickname}}</p>
      </div>
      <div class="user-box2">
        <p>个性签名：</p>
         {{userInfoData.introduction}}
      </div>
      <div class="user-box3">
        <mt-button size="large" type="primary" @click.native.stop="receive(1)">查看收到的招呼</mt-button>
        <mt-button size="large" type="primary" @click.native.stop="receive(2)">查看打出的招呼</mt-button>
      </div>
      <div class="user-box4">
        <p>标签：</p>
        <div class="biaoqian">
          {{userInfoData.interest}}
        </div>
      </div>
    </section>
    <div>
      <transition name="slideup">
        <div class="greet" v-show="showGreet" ref="greet"  @click.stop="showGreet = !0">
          <div class="send-list large" @click="sendGift(item)" v-for="(item, i) in giftList" :key="i">
            <img :src="item.image" >
            <p>{{item.giftName}}{{item.giftPrice > 0 ? `￥${item.giftPrice}` : ''}}</p>
          </div>
        </div>
      </transition>
      <div class="bottom">
        <mt-button size="large" type="primary" @click.native.stop="greet">打招呼</mt-button>
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
import wx from 'weixin-js-sdk'
import { MessageBox, Indicator, Toast } from 'mint-ui'
import store from '@/store/'
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      isShow: !1,
      preImgIsLoading: !0,
      title: '',
      showGreet: !1,
      userInfoData: {},
      giftList: [],
      id: 0,
      type: 1,
      token: localStorage.getItem('token'),
      websocket: null
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      barInfo: state => state.user.barInfo
    })
  },
  methods: {
    linkTo (path, item) {
      if (path == 'greet') {
        this.$router.push({
          path: `/greet?type=${this.type}&id=${this.id}`
        })
      } else {
        this.send(item)
        Toast('送出礼物成功！')
        this.toChat()
      }
    },
    // 微信支付
    wxpay (data, path, item) {
      let self = this
      const {appId, timeStamp, nonceStr, signType, paySign} = data.payParams
      function onBridgeReady () {
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            'appId': appId,
            'timeStamp': timeStamp,
            'nonceStr': nonceStr,
            'package': data.payParams.package,
            'signType': signType,
            'paySign': paySign
          },
          function (res) {
            if (res.err_msg == 'get_brand_wcpay_request:ok') {
              self.linkTo(path, item)
            }
          })
      }
      if (typeof WeixinJSBridge == 'undefined') {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
          document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
        }
      } else {
        onBridgeReady()
      }
    },
    receive (type) { // 1:收到，2：打出的招呼
      this.type = type
      const source = type == 2 ? 5 : 6
      const text = type == 2 ? '查看打出的招呼' : '查看收到的招呼'
      const data = {
        'APP-Token': this.token,
        type: 'other',
        viewUserId: this.id,
        direction: this.type == 1 ? 'from' : 'to'
      }
      Indicator.open()
      this.$get('/user/greeting', data).then(res => {
        Indicator.close()
        if (res.ret === -2) {
          // 未支付
          MessageBox.confirm('查看招呼需要支付20元，确定支付?').then(action => {
            // source：1-打招呼，2-表示，3-请TA喝酒, 5-查看打出招呼，6-查看被打的招呼
            this.$post(`/pay/create_order/${source}?amount=0.01&deliveryUserId=${this.id}&goodName=${text}&description="查看招呼"`, {
              'APP-Token': this.token
            }).then(res => {
              // this.wechatpay(res)
              this.wxpay(res, 'greet')
            })
          })
        } else {
          this.$router.push({
            path: `/greet?type=${this.type}&id=${this.id}`
          })
        }
      })
    },
    greet (item) {
      if (this.giftList && this.giftList.length > 0) {
        return
      }
      Indicator.open()
      this.$get(`/mch/gift/greet`, {'APP-Token': this.token}).then(res => {
        Indicator.close()
        if (res.ret === 0) {
          this.showGreet = !0
          this.giftList = res.data.records
        }
      })
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
    sendGift (item) {
      if (item.price == 0) {
        // 调用IM 传入到聊天消息里
        this.send(item)
        this.toChat()
      }
      // source：1-打招呼，2-表示，3-请TA喝酒, 5-查看打出招呼，6-查看被打的招呼
      this.$post(`/pay/create_order/1?amount=${item.price}&deliveryUserId=${this.id}&goodName=${item.price}&description=${item.description}`, {
        'APP-Token': this.token
      }).then(res => {
        this.wxpay(res, 'chat', item)
      })
    },
    toChat () {
      setTimeout(() => {
        this.$router.push({
          path: '/chat',
          query: {
            id: this.id,
            nickname: this.userInfoData.nickname
          }
        })
      }, 3000)
    },
    initWebSocket () {
      // 连接错误
      this.websocket.onerror = this.setErrorMessage
      // //连接成功
      this.websocket.onopen = this.setOnopenMessage
      // 收到消息的回调
      this.websocket.onmessage = this.setOnmessageMessage
      // 连接关闭的回调
      this.websocket.onclose = this.setOncloseMessage
      // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = this.onbeforeunload
    },
    setErrorMessage () {
      console.log('WebSocket连接发生错误' + '   状态码：' + this.websocket.readyState)
    },
    setOnopenMessage () {
      console.log('WebSocket连接成功' + '   状态码：' + this.websocket.readyState)
    },
    setOnmessageMessage (event) {
      console.log('服务端返回：' + event.data)
    },
    setOncloseMessage () {
      console.log('WebSocket连接关闭' + '   状态码：' + this.websocket.readyState)
    },
    onbeforeunload () {
      this.closeWebSocket()
    },

    // websocket发送消息
    send (data) {
      let extras = {'avatar': '' + this.userInfo.avatar + ''}
      let obj = {}
      obj.chatType = 2 // 0=未知 1=公聊 2=私聊
      obj.msgType = 6 // 0=文本 1=图片 2=语音 3=视频 4=音乐 5=图文 6=订单（礼物、打招呼等） 7=表情
      obj.createTime = +new Date()
      obj.avatar = this.userInfo.avatar
      obj.extras = extras
      obj.nickname = this.userInfo.nickname
      let content = {}
      Object.assign(content, {
        image: '',
        giftName: '',
        id: '',
        giftPrice: ''
      }, data)
      let message = {
        type: 'message',
        token: this.token,
        from: this.userInfo.id,
        to: this.id,
        cmd: 11,
        content,
        ...obj
      }
      this.websocket.send(JSON.stringify(message))
    },
    closeWebSocket () {
      this.websocket.close()
    }
  },
  mounted () {
    this.token = localStorage.getItem('token')
    // this.token = '7679ee4d-d459-48ff-a099-3b03c2af68ea'
    this.id = this.$route.query.id
    this.title = this.$route.query.tabNum ? this.$route.query.tabNum + '台' : ''

    let groupId = this.barInfo.bar.id
    let wsURL = 'ws:47.111.41.121:28888?token=' + this.token + '&groupId=' + groupId
    this.websocket = new WebSocket(wsURL)
    this.initWebSocket()

    Indicator.open()

    this.$get(`/user/userInfo`, {userId: this.id, 'APP-Token': this.token}).then(res => {
      Indicator.close()
      if (res.ret === 0) {
        this.userInfoData = res.data || {}
      }
    })
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
    }
  }
  .user-box3{
    margin: .3rem auto;
    width: 7.1rem;
    display: flex;
    justify-content: space-between;
    button{
      width: 3.4rem;
      height: .8rem;
      text-align: center;
      line-height: .8rem;
      border-radius: .08rem;
    }
  }
  .user-box4{
    margin: auto;
    padding: .4rem .2rem;
    width: 7.1rem;
    box-sizing: border-box;
    border: 1px solid #ddd;
    border-radius: .08rem;
    p{
      margin: 0 0 .3rem;
      // background: url(../assets/images/love-icon.png) left center no-repeat;
      background-size: contain;
    }
    .biaoqian{
      display: flex;
      flex-wrap: wrap;
      span{
        padding: .13rem .2rem;
        margin: .2rem;
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
      width: .8rem;
      height: .8rem;
    }
  }
  .large{
    margin-right: .4rem;
    margin-left: .4rem;
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
