<template>
  <div class="wrap">
    <div class="file-con">
      <div>
        <img v-if="!userInfoData.avatar.length" src="../assets/images/camera.png">
        <img v-else :src="userInfoData.avatar">
        <i></i>
      </div>
      <input class="file" type="file" id="file" accept="image/*" @change="upload">
    </div>
    <div class="tips">头像请用本人照片</div>
    <div>
      <div class="input-box"></div>
      <mt-field class="my-input font-3" label="昵称" type="text" v-model="userInfoData.nickname" :attr="{ maxlength: 11 }" placeholder="请输入昵称"></mt-field>
      <div class="input-box"></div>
      <mt-field class="my-input font-3 required" label="手机号" type="tel" v-model="phone" :attr="{ maxlength: 11 }" placeholder="请输入手机号"></mt-field>
      <div class="input-box"></div>
      <mt-field class="my-input font-3 required" label="验证码" type="tel" v-model="code" :attr="{ maxlength: 6 }" placeholder="请输入短信验证码">
        <span class="send-code" :class="codeState == 3 ? 'disabled':''" @click="sendCode">{{codeTxt}}</span>
      </mt-field>
      <div class="input-box"></div>
      <mt-field class="my-input" label="兴趣爱好" v-model="interest" placeholder="请输入兴趣爱好"></mt-field>
      <div class="input-box"></div>
      <div @click="showCityDlg">
        <mt-field class="my-input" label="地区" v-model="city" placeholder="请选择" :attr="{disabled: true}"></mt-field>
      </div>

      <div class="input-box"></div>
      <div class="input-box"></div>
      <div class="picker-wrap" v-show="showCity">
        <transition name="slide-down">
          <div class="picker-cnt">
            <div class="txt-btn-wrap">
            <span class="txt-btn cancel" @click="hideCityDlg">取消</span>
            <span class="txt-btn ok" @click="cnfrmAddrArea">确认</span>
          </div>
            <mt-picker :slots="addressSlots" @change="onAddressChange" :visible-item-count="5"></mt-picker>
          </div>
        </transition>
      </div>
    </div>
    <div class="page-button-group">
      <mt-button size="large" type="primary" :class="{ 'disabled-btn': !btnGo }" @click="submit">完成</mt-button>
    </div>
  </div>
</template>

<script>
import EXIF from 'exif-js'
import { compressImg, dataURLtoBlob } from '@/utils/imageManage'
import { Indicator, Toast } from 'mint-ui'
import bottom from '@/components/bottom'
import address from '@/utils/city'
import store from '@/store/'
import { mapState, mapMutations } from 'vuex'

export default {
  components: {bottom},
  data () {
    return {
      userInfoData: {
        nickname: '',
        avatar: ''
      }, // 用户信息
      openId: '', // 微信ID
      phone: '',
      code: '',
      codeState: 1,
      countNum: 60,
      timer: null,
      interest: '',
      city: '',
      showCity: !1,
      addressSlots: [
        {
          flex: 1,
          values: Object.keys(address),
          className: 'slot1',
          textAlign: 'center'
        }, {
          divider: true,
          content: '-',
          className: 'slot2'
        }, {
          flex: 1,
          values: ['北京'],
          className: 'slot3',
          textAlign: 'center'
        }
      ],
      addressProvince: '北京',
      addressCity: '北京',
      btnGo: !1
    }
  },
  methods: {
    ...mapMutations(['SAVE_USERINFO']),
    upload (e) {
      let token = localStorage.getItem('token')
      let imageData = new FormData()
      imageData.append('file', e.currentTarget.files[0])
      // 上传图片
      Indicator.open('上传中')
      this.$post('/file/uploadImage?APP-Token=' + token, imageData).then(res => {
        Indicator.close()
        if (res.ret === 0) {
          this.userInfoData.avatar = res.data[0].url
        }
      })
    },
    sendCode () {
      if (this.codeState === 3) {
        return
      }
      if (!this.checkPhone()) {
        return
      }
      Indicator.open('正在发送')
      let token = localStorage.getItem('token')
      this.$get('/sms/smsOfAli', {mobile: this.phone, 'APP-Token': token}).then(res => {
        Indicator.close()
        Toast(res.msg)
        if (res.ret === 0) {
          this.startCounting()
        }
      })
    },
    // 获取验证码倒计时
    startCounting () {
      const start = () => {
        this.countNum--
        if (this.countNum > 0) {
          this.timer = setTimeout(() => {
            start()
          }, 1000)
        } else {
          this.countNum = 60
          this.codeState = 2
          clearTimeout(this.timer)
        }
      }
      this.codeState = 3
      start()
    },
    // 校验手机号
    checkPhone () {
      let bool = !0
      if (this.phone.length == 0) {
        bool = !1
        Toast('请输入手机号码')
      } else if (!/^1\d{10}$/.test(this.phone)) {
        bool = !1
        Toast('请输入正确的手机号码')
      }
      return bool
    },
    // 校验验证码
    checkCode () {
      let bool = !0
      if (this.code.length == 0) {
        bool = !1
        Toast('请输入验证码')
      } else if (!/^\d{6}$/.test(this.code)) {
        bool = !1
        Toast('请输入6位验证码')
      }
      return bool
    },
    showCityDlg () {
      this.showCity = !0
    },
    onAddressChange (picker, values) {
      picker.setSlotValues(1, address[values[0]])
      this.addressProvince = values[0]
      this.addressCity = values[1]
    },
    hideCityDlg () {
      this.showCity = !1
    },
    cnfrmAddrArea () {
      this.showCity = !1
      this.city = this.addressCity
    },
    submit () {
      if (!this.checkPhone() || !this.checkCode()) {
        return false
      }
      if (!this.userInfoData.avatar) {
        Toast('请设置个人头像')
        return false
      }
      // const data = {
      //   mobile: this.phone,
      //   nickName: this.userInfoData.nickname,
      //   code: this.code,
      //   interest: this.interest,
      //   city: this.city,
      //   openId: this.userInfoData.weixinOpenid
      // }

      const data = `avatar=${this.userInfoData.avatar}&nickName=${this.userInfoData.nickname}
      &mobile=${this.phone}&code=${this.code}&interest=${this.interest}&city=${this.city}
      &openId=${this.openId}`
      Indicator.open()
      let token = localStorage.getItem('token')
      this.$post('/regist/saveUser?APP-Token=' + token, data).then(res => {
        Indicator.close()
        Toast(res.msg)
        if (res.ret === 0) {
          this.$store.commit('SAVE_USERINFO', res.data.userInfo)
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('openId', res.data.openId)
          setTimeout(() => {
            this.$router.push({
              path: './index'
            })
          }, 3000)
        }
      })
    },
    init () {
      if (store.state.userInfo) {
        this.userInfoData = store.state.userInfo
      }
      this.openId = localStorage.getItem('openId')
    }
  },
  computed: {
    codeTxt () {
      let txt = ''
      let state = this.codeState
      if (state === 1) {
        txt = '立即发送'
      } else if (state === 2) {
        txt = '重新发送'
      } else {
        txt = '重新发送(' + this.countNum + ')'
      }
      return txt
    }
  },
  watch: {
    code: {
      handler () {
        if (this.code.length == 6 && this.phone != '') {
          this.btnGo = !0
        }
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped lang="scss">
.wrap {
  padding-bottom: 1.2rem;
  .file-con {
    position: relative;
    width: 2rem;
    height: 2rem;
    margin: 0.5rem auto;
    & > div {
      width: 2rem;
      height: 2rem;
      img {
        width: 2rem;
        height: 2rem;
      }
    }
    .file {
      width: 2rem;
      height: 2rem;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
    }
  }
  .nick {
    text-align: center;
    font-size: 0.32rem;
  }
  .tips {
    margin: .4rem 0;
    text-align: center;
    color: #f60;
    font-size: 0.26rem;
  }
  .input-box {
    width: 7.5rem;
    height: 0.2rem;
    background: #f0f0f0;
  }
  .text-left {
    margin: 0.8rem 0 0.2rem 0.3rem;
    font-size: 0.32rem;
  }
  .required:before{
    content: '*';
    position: absolute;
    left: 12px;
    top: 20px;
    font-size: 16px;
    color: #f00;
  }
  .my-input {
    margin-left: .1rem;
    position: relative;
  }
  .font-3{
    padding-left: 14px;
  }
  .page-button-group{
    width: 7.5rem;
  }
  .send-code{
    font-size: .28rem;
    color: #f60;
  }
  .disabled{
    color: #999
  }
  .disabled-btn{
    background: #DBDBDB;
  }
  .btnGo{
    background: #26a2ff;
  }
}
// .mint-button{
//   border-radius: 0;
// }
.picker-wrap {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .5);
  .picker-cnt {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    z-index: 1000;
    .txt-btn-wrap {
      display: flex;
      height: 100%;
      padding: .2rem 0.3rem;
      border-bottom: 1px solid #eaeaea;
    }
    .txt-btn {
      display: flex;
      flex: 1;
      align-items: center;
      font-size: 0.28rem;
      &.ok {
        color: #f60;
        justify-content: flex-end;
      }
      &.tit {
        justify-content: center;
      }
    }
  }
  .picker-bg {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
}
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s linear;
}
.slide-down-enter,
.slide-down-leave-to {
  transform: translate3d(0, 100%, 0);
}

</style>
