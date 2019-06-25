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
        <img :src="orderData.imageUrl">
        <div>{{orderData.goodsName}}</div>
      </div>
      <div class="order-list">
        <div>支付时间：{{orderData.placeOrderTime}}</div>
        <div>订单编号：{{orderId}}</div>
        <div>支付金额：￥{{orderData.price}}</div>
        <div style="padding-left: .7rem">收货人：{{orderData.orderUserName}}</div>
      </div>
      <div class="text-center">
        <mt-button type="primary" size="small" @click="submit">提交</mt-button>
      </div>
    </section>
    <bottom></bottom>
  </div>
</template>

<script>
import { getParams } from '@/utils/common'
import bottom from '@/components/bottom'
import uploader from '@/components/Upload'
import { Indicator, Toast } from 'mint-ui'
export default {
  components: {bottom, uploader},
  data () {
    return {
      token: '',
      orderData: [],
      reason: '',
      orderId: 0,
      imgList: [] // 已上传的图片集合
    }
  },
  methods: {
    submit () {
      if (this.reason == '') {
        Toast('请输入退款原因')
        return
      }
      let obj = {
        'APP-Token': this.token,
        reason: this.reason,
        payOrderId: this.orderData.payOrderId,
        image: this.imageUrlList
      }
      let data = getParams(obj)
      Indicator.open()
      this.$get('/mch/refund/apply?' + data).then(res => {
        Indicator.close()
        Toast(res.msg)
        if (res.ret === 0) {
          setTimeout(() => {
            this.$router.go(-1)
          }, 3000)
        }
      })
    },
    getImageList (files) {
      this.$nextTick(() => {
        let imageData = new FormData()
        for (let i = 0, len = files.length; i < len; i++) {
          this.imgList.push(files[i].src.split('base64,')[1])
          imageData.append('file', files[i].file)
        }
        let token = localStorage.getItem('token')
        // 上传图片
        Indicator.open('上传中')
        this.$post('/file/uploadImage?APP-Token=' + token, imageData).then(res => {
          Indicator.close()
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
    },
    init () {
      this.token = localStorage.getItem('token')
      this.orderId = this.$route.query.orderId
      Indicator.open()
      this.$get('/mch/order/detail', {orderId: this.orderId, 'APP-Token': this.token}).then(res => {
        Indicator.close()
        if (res.ret === 0) {
          this.orderData = res.data
          this.status = res.data.status
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
