<template>
  <div class="order-wrap">
    <section class="order-con">
      <div class="order-top">
        <div>夜王酒吧-订单详情</div>
        <div class="con-right">等待商家退款中</div>
      </div>
      <div class="order-main">
        <img src="../../assets/images/touxiang2.jpg">
        <div>一打百威（12瓶）</div>
      </div>
      <div class="order-list">
        <div>支付时间：{{+new Date()}}</div>
        <div>支付金额：￥{{500}}</div>
        <div>收货人：{{'你的小可爱'}}</div>
      </div>
      <div class="fr">
        <mt-button @click="toRefund" type="primary" size="small">退款</mt-button>
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

    }
  },
  methods: {
    toRefund () {
      this.$router.push({
        path: 'refund'
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
}
.order-top{
  display: flex;
  justify-content: space-between;
  margin-bottom: .2rem;
  padding: .3rem .4rem;
  background: #fff;
  color: #333;
  font-size: .32rem;
  font-weight: 600;
  .con-right{
    font-size: .28rem;
    font-weight: normal;
    color: #666;
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
.fr{
  padding-right: .2rem;
  text-align: right;
}
</style>
