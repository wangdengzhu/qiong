<template>
  <div class="order-wrap">
    <section class="order-con">
      <mt-header :title="barInfo.bar && barInfo.bar.name+'-订单详情'">
        <mt-button @click="$router.go(-1)" icon="back" slot="left"></mt-button>
      </mt-header>
      <div class="order-top">{{statusDec[status]}}</div>
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
      <div class="fr">
        <mt-button v-if="status == 0 || status == 1" @click="toRefund" type="primary" size="small">退款</mt-button>
      </div>
    </section>
    <bottom></bottom>
  </div>
</template>

<script>
import bottom from '@/components/bottom'
import { Indicator, Toast } from 'mint-ui'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {bottom},
  data () {
    return {
      orderId: 0,
      status: 0, // 订单状态：0-下单，1-接单，2-取消，3-完成，4-退款申请,5-拒绝退款，6-退款完成
      statusDec: [
        '您已经下单成功',
        '商家已经接单',
        '您的订单已取消',
        '您的订单已完成',
        '等待商家退款中',
        '商家拒绝退款',
        '退款完成'
      ],
      orderData: {}
    }
  },
  computed: {
    ...mapState({
      barInfo: state => state.user.barInfo
    })
  },
  methods: {
    toRefund () {
      this.$router.push({
        path: 'refund'
      })
    },
    init () {
      this.orderId = this.$route.query.orderId
      Indicator.open()
      let token = localStorage.getItem('token')
      this.$get('/mch/order/detail', {orderId: this.orderId,'APP-Token': token}).then(res => {
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
}
.order-top{
  margin-bottom: .2rem;
  padding: .3rem .4rem;
  background: #fff;
  color: #333;
  font-size: .32rem;
  font-weight: 600;
  text-align: center;
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
.fr{
  padding-right: .2rem;
  text-align: right;
}
</style>
