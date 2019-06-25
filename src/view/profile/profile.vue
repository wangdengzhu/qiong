<template>
  <div class="profile-wrap">
    <section class="user-con">
      <div class="avatar-item">
        <span>头像</span>
        <div>
          <img :src="userInfo && userInfo.avatar" alt>
          <i></i>
        </div>
        <input type="file" class="file-inp" accept="image/*" @change="uploadImg($event)">
      </div>
      <div class="ht20"></div>
      <div class="list-box" @click="navTo('username', userInfo.nickname)">
        <div>昵称<span class="text-right">{{userInfo.nickname}}</span></div>
      </div>
      <div class="ht20"></div>
      <div class="list-box" @click="navTo('signature', userInfo.introduction)">
        <div>个性签名<span class="text-right">{{userInfo.introduction}}</span></div>
      </div>
      <div class="ht20"></div>
      <div class="list-box" @click="navTo('hobby', userInfo.interest)">
        <div>兴趣爱好</div>
      </div>
      <div class="ht20"></div>
      <div class="list-box" @click="showCityDlg">
        <div>地区<span class="text-right">{{city}}</span></div>
      </div>
      <div class="ht20"></div>
      <div class="list-box" @click="toMyGift">
        <div>我的礼物</div>
      </div>
      <div class="ht20"></div>
      <div class="list-box" @click="toFeedback">
        <div>意见反馈</div>
      </div>
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
    </section>
    <bottom></bottom>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { Indicator, Toast } from 'mint-ui'
import bottom from '@/components/bottom'
import address from '@/utils/city'
import { mapState, mapMutations } from 'vuex'
import store from '@/store/'
export default {
  components: {bottom},
  data () {
    return {
      isShow: !1,
      preImgIsLoading: !0,
      city: '',
      addressSlots: [
        {
          flex: 1,
          values: Object.keys(address),
          textAlign: 'center'
        }, {
          divider: true,
          content: '-'
        }, {
          flex: 1,
          values: ['北京'],
          textAlign: 'center'
        }
      ],
      addressProvince: '北京',
      addressCity: '北京',
      showCity: !1
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  methods: {
    ...mapMutations(['SAVE_USERINFO']),
    uploadImg (e) {
      let token = localStorage.getItem('token')
      let imageData = new FormData()
      imageData.append('file', e.currentTarget.files[0])
      // 上传图片
      Indicator.open('上传中')
      this.$post('/file/uploadImage?APP-Token=' + token, imageData).then(res => {
        Indicator.close()
        if (res.ret === 0) {
          let url = res.data[0].url
          Indicator.open('保存中...')
          this.$post('/user/modify?APP-Token=' + token, {avatar: url}).then(res => {
            Indicator.close()
            Toast(res.msg)
            if (res.ret == 0) {
              this.init()
            }
          })
        }
      })
    },
    navTo (type = '', text = '') {
      this.$router.push({
        path: `/profile/${type}?text=${encodeURIComponent(text)}`
      })
    },
    toMyGift () {
      this.$router.push({
        path: '/mygift'
      })
    },
    toFeedback () {
      this.$router.push({
        path: '/feedback'
      })
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
      Indicator.open('保存中...')
      let token = localStorage.getItem('token')
      this.$post('/user/modify?APP-Token=' + token, {location: this.city}).then(res => {
        Indicator.close()
        Toast(res.msg)
      })
    },
    // 获取个人信息
    init () {
      if (this.userInfo.id) {
        this.city = this.userInfo.location
        return
      }
      let token = localStorage.getItem('token')
      this.$get('/user/myInfo', {'APP-Token': token}).then(res => {
        if (res.ret === 0) {
          this.city = res.data.baseInfo.location
          store.commit('SAVE_USERINFO', res.data.baseInfo)
          store.commit('SAVE_COUNTINFO', res.data.account)
        }
      })
    }
  },
  mounted () {
    this.init()
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
  padding: 0;
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
  .list-box{
    margin-right: .2rem;
    padding: .4rem .2rem;
    background: url(../../assets/images/list-icon.png) right center no-repeat;
    background-size: .16rem .26rem;
    div{
      overflow: hidden;
      padding: 0 .2rem;
      .text-right{
        float: right;
        display: block;
        width: 3rem;
        height: .4rem;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        text-align: right;
      }
      .text-right-img{
        float: right;
        height: .8rem;
      }
    }
    .flex{
      justify-content: space-between;
      span{
        line-height: .8rem;
      }
    }
  }
  .list-box1{
    padding: .2rem;
  }
  .avatar-item {
    position: relative;
    height: 1.28rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e5e5e5;
    padding: .2rem .2rem .2rem .4rem;
    box-sizing: border-box;
    div {
      display: flex;
      align-items: center;
    }
    i {
      display: block;
      width: 0.16rem;
      height: 0.26rem;
      margin-left: 0.2rem;
      background: url(../../assets/images/list-icon.png) right center no-repeat;
      background-size: .16rem .26rem;
    }
    span {
      flex: 1;
      font-size: 0.3rem;
      line-height: .8rem;
    }
    p {
      color: #666;
      font-size: 0.28rem;
      line-height: 1;
    }
    img {
      height: .8rem;
      vertical-align: middle;
    }
    .file-inp {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }
}

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
