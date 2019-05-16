<template>
  <div class="order-wrap">
    <section class="order-con">
      <div class="user-box">
        <p>退款原因：</p>
        <mt-field class="my-input" label="" v-model="reason" placeholder="请输入退款原因"></mt-field>
      </div>
      <div class="ht20"></div>
      <div class="user-box1">
        <p>添加图片：</p>
        <uploader @getFiles='getImageList' @removeFiles='removeImage'></uploader>
      </div>
      <div class="ht20"></div>
      <div class="order-main">
        <img src="../../assets/images/touxiang2.jpg">
        <div>一打百威（12瓶）</div>
      </div>
      <div class="order-list">
        <div>支付时间：{{+new Date()}}</div>
        <div>支付金额：￥{{500}}</div>
        <div>收货人：{{'你的小可爱'}}</div>
      </div>
      <div class="text-center">
        <mt-button type="primary" size="small">提交</mt-button>
      </div>
    </section>
    <bottom></bottom>
  </div>
</template>

<script>
import bottom from '@/components/bottom'
import uploader from '@/components/Upload'
export default {
  components: {bottom, uploader},
  data () {
    return {
      reason: '',
      imgList: [] // 已上传的图片集合
    }
  },
  methods: {
    getImageList (files) {
      this.$nextTick(() => {
        for (let i = 0, len = files.length; i < len; i++) {
          this.imgList.push(files[i].src.split('base64,')[1])
          // 上传图片
          //   this._getFileCode({
          //     Base64Str: files[i].src.split("base64,")[1],
          //     AttachmentType: this.$enums.AttachmentType.Activity
          //   });
        }
      })
    },
    // 删除图片
    removeImage (index) {
      this.imgList.splice(index, 1)
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
.order-wrap{
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: #f0f0f0;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
  font-size: .3rem;
  .order-con{
    margin-bottom: 1.4rem;
    .user-box{
      padding: .2rem;
      display: flex;
      background: #fff;
      font-size: .3rem;
      p{
        margin-top: .35rem;
      }
    }
    .user-box1{
      padding: .2rem;
      background: #fff;
      p{
        margin-top: .35rem;
        font-size: .3rem;
      }
    }
    .order-main{
      display: flex;
      padding: .4rem;
      background: #fff;
      img{
        width: 2rem;
        height: 2rem;
        margin-right: .4rem;
      }
    }
    .order-list{
      div{
        padding: .2rem .4rem;
        margin: .2rem 0;
        background: #fff;
      }
    }
    .text-center{
      text-align: center;
    }
  }
}

</style>
