<template>
  <div class="profile-wrap">
    <mt-header title="意见反馈">
        <mt-button @click="$router.go(-1)" slot="left" icon="back"></mt-button>
      </mt-header>
    <section class="user-con">
      <div class="ht20"></div>
      <div class="user-box2 flex" @click="showOpinionDlg">
        <div>反馈类型：<span class="text-right"> {{value}}</span></div>
      </div>
      <div class="ht20"></div>
      <div class="user-box2">
        <p>反馈内容：</p>
        <mt-field label="" placeholder="请输入反馈内容" type="textarea" rows="4" v-model="content"></mt-field>
      </div>
      <div class="ht20"></div>
      <div class="user-box2">
        <p>添加图片：</p>
        <uploader @getFiles='getImageList' @removeFiles='removeImage'></uploader>
      </div>
      <div class="ht20"></div>
      <mt-field label="" type="tel" placeholder="请留下您的联系方式" v-model="phone"></mt-field>
      <div class="ht20"></div>
      <mt-button type="primary" size="large" @click="submit">提交</mt-button>
      <div class="picker-wrap" v-show="showQuestion">
        <transition name="slide-down">
          <div class="picker-cnt">
            <div class="txt-btn-wrap">
            <span class="txt-btn cancel" @click="hideOpinion">取消</span>
            <span class="txt-btn ok" @click="cnfrmOpinion">确认</span>
          </div>
            <mt-picker :slots="options" @change="onOpinionChange" :visible-item-count="3"></mt-picker>
          </div>
        </transition>
      </div>
    </section>
    <bottom></bottom>
  </div>
</template>

<script>
import bottom from '@/components/bottom'
import uploader from '@/components/Upload'
import { getParams } from '@/utils/common'
import { Indicator, Toast } from 'mint-ui'
export default {
  components: {bottom, uploader},
  data () {
    return {
      phone: '',
      content: '',
      imgList: [], // 已上传的图片集合
      isSubmit: false,

      value: '',
      options: [
        {
          flex: 1,
          values: ['请选择', '支付问题', '功能异常', '产品建议', '其他']
        }
      ],
      showQuestion: !1,
      imageUrlList: []
    }
  },
  methods: {
    submit () {
      if (this.value == '' || this.value == '请选择') {
        Toast('请选择反馈类型！')
        return
      }
      if (this.content == '') {
        Toast('请输入反馈内容！')
        return
      }
      let value = this.value
      let type = value == '支付问题' ? 1
        : value == '功能异常' ? 2
          : value == '产品建议' ? 3
            : value == '其他' ? 4
              : 0
      Indicator.open()
      let token = localStorage.getItem('token')
      let obj = {
        'APP-Token': token,
        type: type,
        content: this.content,
        image: this.imageUrlList,
        contact: this.phone
      }
      let data = getParams(obj)
      this.$get('/feed/apply?' + data).then(res => {
        Indicator.close()
        if (res.ret === 0) {
          Toast('反馈成功！')
          setTimeout(() => {
            this.$router.push({
              path: '/profile/profile'
            })
          }, 3000)
        }
      })
    },
    showOpinionDlg () {
      this.showQuestion = !0
    },
    onOpinionChange (picker, values) {
      this.value = values[0]
    },
    hideOpinion () {
      this.showQuestion = !1
    },
    cnfrmOpinion () {
      this.showQuestion = !1
    },
    getImageList (files) {
      this.$nextTick(() => {
        let imageData = new FormData()
        for (let i = 0, len = files.length; i < len; i++) {
          this.imgList.push(files[i].src.split('base64,')[1])
          imageData.append('file', files[i].file)
        }
        // 上传图片
        let token = localStorage.getItem('token')
        this.$post('/file/uploadImage?APP-Token=' + token, imageData).then(res => {
          if (res.ret === 0) {
            this.imageUrlList = res.data.map(item => {
              return item.url
            })
          }
        })
      })
    },
    // 删除图片
    removeImage (index) {
      this.imgList.splice(index, 1)
      this.imageUrlList.splice(index, 1)
    },
    toMyGift () {
      this.$router.push({
        path: '/mygift'
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
    padding: .2rem;
    p{
      margin: 0 0 .2rem;
    }
    .fd1{
      line-height: 40px;
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
