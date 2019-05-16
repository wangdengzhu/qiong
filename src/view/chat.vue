<template>
<div class="chat-wrap">
  <div class="chat-container"  @click="hideFooter">
    <div class="chat-list " ref="chatList" :class="{ history: historyMessage.length > 0 }">
      <div v-if="!isLoadOver" @click="loadMoreMessage" class="message-loadmore">
        <i v-if="isLoadingMore" class="icon-msg-loading"></i>
        <span v-else>加载{{ historyMessage.length > 0 ? '更多' : '历史' }}消息</span>
      </div>
      <div class="message-list " v-if="historyMessage.length">
        <ul class="ml__box">
          <li v-for="(message, idx) in historyMessage" :class="[ message.from == from ? 'self' : 'another']"  class="ml__item" :key="idx">
            <div class="ml__time" v-if="isShowMsgTime(message, idx, historyMessage)">
              <span class="ml__time-txt">{{formatMsgTime(message)}}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div class="chat-middle">
    <div @click="showFooter(3)">
      <img src="../assets/images/gift-icon-color.png">
      <span>表示</span>
    </div>
    <div @click="showFooter(4)">
      <img src="../assets/images/beer-icon.png">
      <span>表示请你</span>
    </div>
  </div>
  <div class="chat-footer">
    <div class="cf__main" >
      <div class="cf__inp">
        <input ref="messageInp" type="text" maxlength="500" v-model="messageTxt" @focus="focusHandler" @blur="blurHandler">
      </div>
      <div class="cf__btns">
        <i @click="showFooter(1)" class="btn btn-smile" :class="{active: showType == 1}"></i>
        <span @click="sendTextMsg" v-if="messageTxt.length" class="send-btn">发送</span>
        <i v-else @click="showFooter(2)" class="btn btn-plus" :class="{active: showType == 2}"></i>
      </div>
    </div>
    <div class="cf__bd tb1px" v-show="showType > 0">
      <div class="cf__emotion" v-show="showType == 1">
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="i in emotionPageNum">
              <ul class="emotion__box">
                <li @click="emotionHandler(item)" v-for="item in emotion.slice((i-1)*29, (i-1)*29 + 29)" class="emotion__item">
                  <img :src="emotionBaseURL+item.icon" alt="">
                </li>
                <li @touchstart="emotionStart" @touchend="emotionEnd" @click="emotionDel" class="emotion__item del">
                  <span class="img"></span>
                </li>
              </ul>
            </div>
          </div>
          <div class="swiper-pagination"></div>
        </div>
      </div>
      <div class="cf__menu" v-show="showType == 2">
        <ul class="menu__box">
          <li class="menu__item album">
            <i class="icon"></i>
            <span class="txt">相册</span>
            <input @change="imgChangeHandler" class="img-file" type="file" accept="image/*">
          </li>
        </ul>
      </div>
      <div class="cf__menu" v-show="showType == 3">
        <ul class="menu__box gift-box">
          <li class="menu__item" v-for="n in 6" :key="n">
            <img src="../assets/images/gift-icon-color.png">
            <span class="txt">礼物</span>
          </li>
        </ul>
      </div>
      <div class="cf__menu" v-show="showType == 4">
        <ul class="menu__box gift-box">
          <li class="menu__item" v-for="n in 3" :key="n">
            <img src="../assets/images/beer-icon.png">
            <span class="txt">啤酒</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import IM from '@/utils/im'
import bottom from '@/components/bottom'
import Swiper from 'swiper/dist/js/swiper.min'
import { emotion } from '@/utils/face'
import { Indicator, Toast } from 'mint-ui'
import 'swiper/dist/css/swiper.min.css'
import EXIF from 'exif-js'
import { compressImg, dataURLtoBlob } from '@/utils/imageManage'

const MAX_IMG_SIZE = 10 * 1024 * 1024 // 10MB
const NO_COMPRESS_SIZE = 0.2 * 1024 * 1024 // 200KB， 如果小于200KB，直接上传不压缩
export default {
  components: {bottom},
  data () {
    return {
      workStatus: 1, // 客服状态：1 客服在线 101 客服离线；102 客服正忙; 103 服务器正在开小差;
      inWorkTime: !0, // 是否在客服工作时间
      csWorkTime: '',
      csWorkTimeTips: '',
      im: null,
      serviceType: -1,
      servicertel: '',
      messageTxt: '',
      messageList: [],
      messageIdArr: [],
      from: '',
      sessionIsEnd: !1,

      emotion: emotion,
      emotionPageNum: Math.ceil(emotion.length / 29),
      emotionBaseURL: '',
      emotionSiper: null,
      emotionMap: {},

      showType: -1,
      historyMessage: [],
      lastMessageTime: null,
      isLoadingMore: !1,
      isLoadOver: !1,
      count: 20
    }
  },
  methods: {
    initIMListener () {
      // this.im.on('open', this.openHandler.bind(this))
      this.im.on('message', this.messageHandler.bind(this))
      // this.im.on('close', this.closeHandler.bind(this))
      // this.im.on('error', this.errorHandler.bind(this))
    },
    messageHandler () {
      console.log(11111)
    },
    showFooter (t) {
      if (t == this.showType) {
        this.hideFooter()
        return
      }
      this.showType = t
      this.adjustChatUIScroll()
      if (t == 1 && !this.emotionSiper) {
        this.initEmotion()
      }
    },
    hideFooter () {
      this.showType = -1
    },
    loadMoreMessage () {
      if (this.isLoadingMore || this.isLoadOver) {
        return
      }
      this.isLoadingMore = !0
      const scrollHeight = this.$refs.chatList.scrollHeight
      this.fetchHistoryData().then(res => {
        this.isLoadingMore = !1
        if (res.code !== 1) {
          return
        }
        const items = res.data.items
        if (items.length < this.count) {
          this.isLoadOver = !0
        }
        this.historyMessage = items.concat(this.historyMessage)
        this.lastMessageTime = items[0].time
        setTimeout(() => {
          this.$refs.chatList.scrollTop = this.$refs.chatList.scrollHeight - scrollHeight - 50
        }, 0)
      }).catch(err => {
        this.isLoadingMore = !1
        console.log(err)
      })
    },
    isShowMsgTime (message, idx, messageList) {
      if (message.data.subType == this.msgType.EVAL && !message.data.body.result) {
        return !1
      }
      if (idx == 0) {
        return !0
      }
      const theTime = this.getMsgTimestamp(message.time)
      const lastTime = this.getMsgTimestamp(messageList[idx - 1].time)
      const gap = 5 * 60 * 1000
      if (theTime - lastTime >= gap) {
        return !0
      }
      return !1
    },
    getMsgTimestamp (time) {
      return new Date(time.slice(0, -4).replace(/-/g, '/').replace('T', ' ')).getTime()
    },
    paddingZero (num) {
      return num > 9 ? num : '0' + num
    },
    formatMsgTime (message) {
      let time = this.getMsgTimestamp(message.time)
      let today = new Date().getDate()
      let msgTime = new Date(time)
      let msgday = msgTime.getDate()

      let msgYear = msgTime.getFullYear()
      let thisYear = new Date().getFullYear()

      let msgMonth = msgTime.getMonth()
      let thisMonth = new Date().getMonth()

      let timeStr = ''

      let hh = this.paddingZero(msgTime.getHours())
      let mm = this.paddingZero(msgTime.getMinutes())

      let m = this.paddingZero(msgTime.getMonth() + 1)
      let d = this.paddingZero(msgTime.getDate())

      if (msgYear != thisYear) {
        timeStr = `${msgYear}-${m}-${d} ${hh}:${mm}`
      } else {
        if (msgday < today || msgMonth < thisMonth) {
          timeStr = `${m}-${d} ${hh}:${mm}`
        } else {
          timeStr = `${hh}:${mm}`
        }
      }
      return timeStr
    },
    adjustChatUIScroll () {
      const scrollContainer = this.$refs.chatList
      setTimeout(() => {
        if (scrollContainer.scrollHeight > scrollContainer.clientHeight) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight - scrollContainer.clientHeight + 100
        }
      }, 100)
    },
    focusHandler (event) {
      let $this = event.target
      this.showType = -1
      this.adjustChatUIScroll()
      setTimeout(() => {
        this.scrollToView($this)
        this.interval = setInterval(() => {
          this.scrollToView($this)
        }, 500)
      }, 200)
    },
    blurHandler (event) {
      this.interval && clearInterval(this.interval)
    },
    sendTextMsg () {
      if (!this.messageTxt) {
        return
      }
      this.sendMsg(this.msgType.TEXT, this.messageTxt)
      this.messageTxt = ''
      this.hideFooter()
    },

    imgChangeHandler (event) {
      const file = event.target.files[0]
      if (!file) {
        return
      }

      const type = file.type.toLowerCase()
      if (!/gif|jpg|jpeg|png/.test(type)) {
        Toast('请选择图片或不支持该格式图片')
        return
      }

      if (file.size > MAX_IMG_SIZE) {
        Toast('上传图片不能大于10M')
        return
      }

      this.uploadImage(file)
    },

    async uploadImage (image) {
      let self = this
      let { width, height } = await this.getImageDimension(image)

      if (image.size <= NO_COMPRESS_SIZE) { // 如果图片小于规定的大小，直接提交file文件流
        this.startUploadImage(image, width, height)
        return
      }

      let orientation = await this.getImageOrientation(image)
      let reader = new FileReader()
      let quality = 0.3
      reader.onload = function (e) {
        let img = new Image()
        let result = e.target.result
        img.addEventListener('load', callback, false)
        img.src = result
        function callback (e) {
          let newData = compressImg(img, {orientation, quality}) // 压图
          let blob = dataURLtoBlob(newData) // 转为Blob对象
          img = null
          self.startUploadImage(blob, width, height, image.name)
        }
      }
      reader.readAsDataURL(image)
    },

    startUploadImage (image, w, h, name) {
      const formData = new FormData()
      let imgName = image.name || name

      if (name) {
        formData.append('imagefile', image, name)
      } else {
        formData.append('imagefile', image)
      }

      let imgaeURL = window.URL.createObjectURL(image)

      const body = {
        originalphoto: imgaeURL,
        thumbnailphoto: imgaeURL,
        thumbnailwidth: w,
        thumbnailheight: h,
        name: imgName
      }

      const message = this.sendMsg('img', body, !1)

      CustomService.uploadImage(w, h, formData).then(res => {
        message.data.isLoading = !1
        this.im.send('img', res.data, !0)
      }).catch(err => {
        console.log(err)
      })

      this.hideFooter()
    },

    getImageOrientation (image) {
      return new Promise((resolve, reject) => {
        EXIF.getData(image, function () {
          const orientation = EXIF.getTag(this, 'Orientation')
          resolve(orientation)
        })
      })
    },

    getImageDimension (imageFile) {
      return new Promise((resolve, reject) => {
        let image = new Image()
        image.src = window.URL.createObjectURL(imageFile)
        const success = () => {
          resolve({
            width: image.naturalWidth,
            height: image.naturalHeight
          })
        }
        if (image.complete) {
          success()
        } else {
          image.onload = () => {
            success()
          }
          image.onerror = (error) => {
            reject(error)
          }
        }
      })
    },
    emotionParse (txt) {
      return txt.replace(/\/[^\/\s]{1,3}/g, (s) => {
        s = s.trim()
        let e = ''
        let str = ''
        for (let i = 2, len = s.length; i <= len; i++) {
          let eimg = this.emotionMap[s.slice(0, i)]
          if (eimg) {
            e = `<img src=${eimg}>`
            str = s.slice(i, len)
            break
          }
        }
        return e ? e + str : s
      })
    },

    emotionHandler (emotion) {
      this.messageTxt = this.messageTxt + emotion.value + ' '
    },

    emotionDel () {
      if (!this.messageTxt) {
        return
      }
      const text = this.messageTxt
      const re = /\/[^\/]{1,3}$/
      const matches = text.match(re)
      if (matches && this.emotionMap[matches[0].trim()]) {
        this.messageTxt = this.messageTxt.replace(matches[0], '')
        return
      }
      this.messageTxt = this.messageTxt.slice(0, -1)
    },

    emotionStart () {
      if (this.startTimer) {
        clearTimeout(this.startTimer)
      }
      this.isEmotionDelStart = !0
      this.startTimer = setTimeout(() => {
        if (!this.isEmotionDelStart) {
          return
        }
        this.emotionDel()
        this.intervalTimer = setInterval(() => {
          this.emotionDel()
        }, 200)
      }, 900)
    },

    emotionEnd () {
      this.isEmotionDelStart = !1
      if (this.startTimer) {
        clearTimeout(this.startTimer)
      }
      if (this.intervalTimer) {
        clearInterval(this.intervalTimer)
      }
    },

    initEmotion () {
      this.emotionSiper = new Swiper('.swiper-container', {
        pagination: {
          el: '.swiper-pagination'
        },
        observer: !0,
        observeParents: !0
      })
    },

    createEmotionMap () {
      this.emotion.forEach(e => {
        this.emotionMap[e.value] = this.emotionBaseURL + e.url
      })
    }
  },
  beforeCreate () {
    document.title = 'hello'
  },
  mounted () {
    this.im = new IM()
    this.im.init({wsURL: 'ws://192.168.4.25:8080/webSocket'})
    this.initIMListener()
  }
}
</script>
<style scoped lang="scss">
@import '../assets/css/mixins';
@define-extend center{
  display: flex;
  align-items: center;
  justify-content: center;
}
.chat-wrap {
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  font-size: .3rem;
  overflow: auto;
}
.chat-container{
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0.4rem 0.32rem 0;
  padding-top:0;
}
.chat-list{
  flex: 1;
  padding-top: 0.36rem;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  &.history{
    padding-top: 0;
    .ml__item{
      margin-top: .3rem;
    }
  }
  .message-loadmore{
    position: relative;
    padding-top: .2rem;
    padding-bottom: 0.1rem;
    color: #49A0FF;
    font-size: 0.26rem;
    text-align: center;
    line-height: 0.37rem;
    .icon-msg-loading{
      position: static;
      display: inline-block;
    }
  }
}
.icon-msg-loading{
  position: absolute;
  top: 50%;
  left: -0.52rem;
  width: 16px;
  height: 16px;
  margin-top: -8px;
  background: url(../assets/images/icon-loading.png) 0 0/ 16px 16px no-repeat;
  animation: spin1 1s steps(9, end) infinite;
}
.message-list{
  border-bottom: 1px solid transparent;
  .ml__item{
    margin: 0.5rem 0;
    .ml__time{
      text-align: center;
      margin-bottom: 0.4rem;
      .ml__time-txt{
        display: inline-block;
        height: 0.4rem;
        line-height: 0.4rem;
        border-radius: 0.22rem;
        padding: 0 0.15rem;
        font-size: 0.22rem;
        color: #fff;
        background-color: #d9d9d9;
      }
    }
    .ml__cnt{
      display: flex;
      .ml__cnt-box{
        position: relative;
        display: flex;
      }
      .icon-msg-fail{
        position: absolute;
        top: 50%;
        left: -26px;
        width: 16px;
        height: 16px;
        margin-top: -8px;
        background: url(../assets/images/chat/icon-fail.png) 0 0/contain no-repeat;
        &:after{
          content: '';
          position: absolute;
          top: -8px;
          right: -8px;
          bottom: -8px;
          left: -8px;
        }
      }
      .ml__avatar{
        width: 0.78rem;
        height: 0.78rem;
        border-radius: 50%;
      }
      .ml__txt{
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        position: relative;
        max-width: 5.0rem;
        margin-left: 0.2rem;
        line-height: 0.4rem;
        padding: 0.2rem 0.24rem;
        border: 1px solid #e5e5e5;
        border-radius: 0.1rem;
        color: #333;
        font-size: 0.3rem;
        background-color: #fff;
        box-sizing: border-box;
        word-break: break-all;
        white-space: pre-wrap;
        &>>>img{
          display: inline-block;
          width: 0.46rem;
          height: 0.46rem;
          vertical-align: middle;
        }
      }
      .ml__sessionend{
        display: block;
        width: 100%;
        line-height: 0.37rem;
        color: #666;
        font-size: 0.26rem;
        text-align: center;
      }
      .ml__txt:before{
        content: '';
        position: absolute;
        top: 0.21rem;
        width: 0.13rem;
        height: 0.14rem;
      }
      .ml__pic{
        position: relative;
        max-width: 2.2rem;
        margin-left: 0.2rem;
        img{
          display: block;
          width: auto;
          height: auto;
          max-width: 100%;
          border-radius: 0.1rem;
        }
      }
    }
    &.self .ml__pic{
      margin-right: 0.2rem;
      margin-left: 0;
    }
    &.another .ml__txt:before{
      left: -0.13rem;
      background: url(../assets/images/chat/icon-small-arrow-left.png) 0 0/contain no-repeat;
    }
    &.self .ml__cnt{
      justify-content: flex-end;
      .ml__avatar{
        order: 2;
      }
      .ml__txt{
        order: 1;
        margin-left: 0;
        margin-right: 0.2rem;
        color: #fff;
        background-color: #F68954;
        border-color: #F47A3F;
      }
      .ml__txt:before{
        right: -0.13rem;
        background: url(../assets/images/chat/icon-small-arrow-right.png) 0 0/contain no-repeat;
      }
    }
    .ml__cb.box{
      width: 100%;
      padding-top: 0.28rem;
      border-radius: 0.1rem;
      background-color: #fff;
    }
    .ml__comment{
      display: flex;
      margin-top: 0.4rem;
      padding: 0.24rem;
      border-radius: 0.1rem;
      background-color: #fff;
      width: 100%;
      .mlc__item{
        flex: 1;
        text-align: center;
      }
      .comment-icon{
        display: block;
        width: 0.48rem;
        height: 0.48rem;
        margin: 0 auto;
        background-position: 0 0;
        background-size: contain;
        background-repeat: no-repeat;
      }
      @each $icon in laugh, smile, normal, cry {
        .comment-icon.#{$icon}{
          background-image:url('../assets/images/chat/icon-mark-#{$icon}.png');
        }
        .comment-icon.#{$icon}.active{
          background-image: url('../assets/images/chat/icon-mark-#{$icon}-active.png');
        }
      }
      .comment-txt{
        margin-top: 0.08rem;
        color: #666;
        font-size: 0.22rem;
      }
      .comment-icon.active + .comment-txt{
        color: $main-color;
      }
    }
    .ml__cb.box, .ml__comment{
      width: calc(100vw - .62rem);
    }
    .ml__cb.box.fail{
      width: calc(100vw - .62rem - 28px);
    }
  }
}

.chat-footer{
  position: relative;
  z-index: 20;
  background-color: #fff;
  .cf__main{
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 1.2rem;
    padding: 0 0.32rem;
  }
  .cf__bd{
    height: 3.6rem;
    border-top: 1px solid #e5e5e5;
  }
}
.cf__inp{
  width: 5.1rem;
  padding: 0 0.24rem;
  border-radius: 0.38rem;
  background-color: #f5f5f5;
  box-sizing: border-box;
  input{
    width: 100%;
    height: 0.4rem;
    line-height: 0.4rem;
    padding: 0.19rem 0;
    color: #333;
    font-size: 0.28rem;
    vertical-align: top;
  }
}
.cf__btns{
  display: flex;
  margin-left: 0.22rem;
  .btn{
    display: block;
    width: 28px;
    height: 28px;
    background-size: contain;
    background-repeat: no-repeat;
    &.btn-smile{
      background-image: url(../assets/images/chat/icon-smile.png);
      &.active{
        background-image: url(../assets/images/chat/icon-smile-active.png);
      }
    }
    &.btn-plus{
      margin-left: 20px;
      background-image: url(../assets/images/chat/icon-plus.png);
      &.active{
        background-image: url(../assets/images/chat/icon-plus-active.png);
      }
    }
  }
  .send-btn{
    width: 40px;
    height: 28px;
    line-height: 29px;
    background-color: $main-color;
    border-radius: 4px;
    color: #fff;
    font-size: 0.26rem;
    text-align: center;
    margin-left: 14px;
    margin-right: -6px;
  }
}
.cf__menu{
  .menu__box{
    display: flex;
    padding: 0.4rem 0.4rem 0.32rem;
  }
  .gift-box{
    flex-wrap: wrap;
  }
  .menu__item a .txt {
    color: #333;
  }
  .menu__item{
    position: relative;
    width: 1rem;
    margin: 0 .3rem;
    text-align: center;
    font-size: 0.24rem;
    .icon{
      display: block;
      width: 0.82rem;
      height: 0.82rem;
      margin: 0 auto 0.08rem;
      background-repeat: no-repeat;
      background-size: contain;
    }
    &.album .img-file{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0.01;
    }
    &.album .icon{
      background-image: url(../assets/images/chat/icon-album.png);
    }
    &.camera .icon{
      background-image: url(../assets/images/chat/icon-camera.png);
    }
    &.order .icon{
      background-image: url(../assets/images/chat/icon-order.png);
    }
    &.call .icon {
      background-image: url(../assets/images/chat/icon-call.png);
    }
    // &:first-of-type{
    //   margin-left: 0;
    // }
    img{
      display: block;
      width: 0.82rem;
      height: 0.82rem;
      margin: 0 auto 0.08rem;
    }
  }
}
.chat-box{
  padding-top: 0.28rem;
  border: 1px solid #e5e5e5;
  margin-top: 0.4rem;
  border-radius: 0.1rem;
  background-color: #fff;
}
.cb__hd{
  display: flex;
  justify-content: space-between;
  padding: 0 0.24rem 0.2rem;
  margin-top: -0.04rem;
  font-size: 0.22rem;
  .time{
    color: #999;
  }
}
.cb__cnt{
  display: flex;
  padding: 0  0.24rem 0.28rem;
  .cb__pic{
    width: 1.4rem;
    height: 1.4rem;
    background-color: #fff;
    img{
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .cb__info{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    width: 1%;
    line-height: 0.34rem;
    margin-left: 0.24rem;
    font-size: 0.24rem;
    .cb__tit{
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      text-overflow: ellipsis;
      overflow : hidden;
    }
  }
}
.cb__btn{
  height: 0.7rem;
  line-height: 0.7rem;
  border-top: 1px solid #e5e5e5;

  font-size: 0.24rem;
  color: #ccc;
  text-align: center;

  &.active{
    color: #49A0FF;
  }
}

@keyframes spin{
  100%{
    transform: rotate(360deg);
  }
}
@keyframes spin1{
  100%{
    transform: rotate(360deg);
  }
}

.cf__emotion{
  height: 100%;
  .emotion__box{
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    width: 100%;
    align-content: space-between;
    overflow: hidden;
    padding: 0.28rem 0.32rem 0.5rem;
    box-sizing: border-box;
  }
  .emotion__item{
    width: 10%;
    margin: .2rem 0;
    overflow: hidden;
    img,.img{
      display: block;
      width: 0.5rem;
      height: 0.5rem;
      margin: 0 auto;
    }
    &.del{
      user-select: none;
      .img{
        background: url(../assets/images/chat/icon-emotion-del.png) 0 0/contain no-repeat;
      }
    }
  }
}

.chat-middle{
  position: absolute;
  right: -1px;
  top: 2rem;
  div{
    margin: .1rem 0;
    padding: .1rem;
    border: 1px solid #ddd;
    border-radius: .06rem;
    img{
      width: .4rem;
      height: .4rem;
      vertical-align: middle;
    }
    span{
      font-size: .3rem;
      vertical-align: middle;
    }
  }
}
</style>
