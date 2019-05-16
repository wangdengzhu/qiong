<template>
  <div class="cash-wrap">
    <section class="cash-con">
      <div class="cash-top">提现金额将存入微信钱包</div>
      <div class="cash-amount">可提现金额： ￥200</div>
      <div class="tips">只能全部提现</div>
      <div class="btn">
        <mt-button size="large" type="primary" @click.native.stop="cash">提现</mt-button>
      </div>
    </section>
    <bottom></bottom>
  </div>
</template>

<script>
import bottom from '@/components/bottom'
import { Indicator, Toast } from 'mint-ui'
import { setTimeout } from 'timers'
export default {
  components: {bottom},
  data () {
    return {

    }
  },
  methods: {
    cash () {
      Toast('提现成功')
      setTimeout(() => {
        this.$router.push({
          path: 'mygift'
        })
      }, 2000)
    },
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
.cash-wrap{
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: #fff;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
  font-size: .3rem;
  .cash-top{
    margin-bottom: .2rem;
    padding: .3rem .4rem;
  }
  .cash-amount{
    margin-bottom: .2rem;
    padding: .3rem .4rem;
    text-align: center;
  }
  .tips{
    margin-bottom: .2rem;
    padding: .3rem .4rem;
    text-align: center;
    color: #f60;
    font-size: .28rem;
  }
  .btn{
    width: 3rem;
    margin: 0 auto;
  }
}

</style>
