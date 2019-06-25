<template>
  <div class="cash-wrap">
    <section class="cash-con">
      <mt-header title="提现">
        <div @click="$router.go(-1)" slot="left">
          <mt-button>取消</mt-button>
        </div>
      </mt-header>
      <div class="cash-top">
        <div class="cash-amount">提现金额：</div>
        <div class="cash-amount">￥{{countInfo ? countInfo.balance : 0}}</div>
      </div>
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
import { mapState, mapMutations } from 'vuex'
export default {
  components: {bottom},
  data () {
    return {

    }
  },
  computed: {
    ...mapState({
      countInfo: state => state.user.countInfo
    })
  },
  methods: {
    cash () {
      if (!this.countInfo || this.countInfo.balance == 0) {
        Toast('提现金额为0')
      }
      Indicator.open()
      let token = localStorage.getItem('token')
      this.$get(`/withdraw`, {'APP-Token': token}).then(res => {
        Indicator.close()
        if (res.ret === 0) {
          Toast('提现成功')
          setTimeout(() => {
            this.$router.push({
              path: 'mygift'
            })
          }, 2000)
        } else {
          Toast(res.msg)
        }
      })
    }
  },
  mounted () {

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
    padding: .3rem .4rem;
    display: flex;
    justify-content: space-between;
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
    width: 2rem;
    margin: 0 auto;
  }
}

</style>
