<template>
  <div class="gift-wrapper">
    <mt-header title="我的礼物">
      <div @click="$router.go(-1)" slot="left">
        <mt-button icon="back"></mt-button>
      </div>
    </mt-header>
    <mt-navbar v-model="selected">
      <mt-tab-item id="1">收到的礼物</mt-tab-item>
      <mt-tab-item id="2">送出的礼物</mt-tab-item>
    </mt-navbar>

    <!-- tab-container -->
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="1">
        <div class="list list-box" @click="toCash">
          <p class="font32">去提现</p>
          <p>共收到{{list1.length}}个礼物，合计￥{{countInfo ? countInfo.balance : 0}}元</p>
        </div>
        <mygiftlist v-if="list1.length>0" :list="list1" type="1"></mygiftlist>
        <div v-else class="empty">没有记录</div>
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <mygiftlist v-if="list2.length>0" :list="list2" type="2"></mygiftlist>
        <div v-else class="empty">没有记录</div>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>

<script>
import mygiftlist from '@/components/mygiftlist'
import { Indicator, Toast } from 'mint-ui'
import store from '@/store/'
import { mapState, mapMutations } from 'vuex'
export default {
  components: { mygiftlist },
  data () {
    return {
      selected: '1',
      list1: [],
      list2: [],
      money: 0
    }
  },
  computed: {
    ...mapState({
      countInfo: state => state.user.countInfo
    })
  },
  methods: {
    toCash () {
      this.$router.push({
        path: '/cash'
      })
    },
    init () {
      let token = localStorage.getItem('token')
      Indicator.open()
      this.$get('/mch/gift/receive', {'APP-Token': token}).then(res => {
        Indicator.close()
        if (res.ret === 0) {
          this.list1 = res.data.gifts.records
        }
      })
      this.$get('/mch/gift/send', {'APP-Token': token}).then(res => {
        Indicator.close()
        if (res.ret === 0) {
          this.list2 = res.data.gifts.records
        }
      })
      this.$get('/user/myInfo', {'APP-Token': token}).then(res => {
        if (res.ret === 0) {
          this.money = res.data.account ? res.data.account.balance : 0
          store.commit('SAVE_USERINFO', res.data.baseInfo)
          store.commit('SAVE_COUNTINFO', res.data.account)
        }
      })
    }
  },
  mounted () {
    this.gift = this.$route.query.gift
    this.init()
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/mixins.css';
.gift-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  background-color: #fff;
  font-size: .28rem;
  .list{
    margin: 0 .2rem;
    padding: .4rem .2rem .4rem 0;
    border-bottom: 1px solid #ddd;
    .font32{
      margin-bottom: .1rem;
      font-size: .32rem;
    }
    .sugest{
      display: flex;
      justify-content: space-between;
      div{
        line-height: .8rem;
        img{
          height: .8rem;
          vertical-align: middle;
        }
      }
    }
  }
  .list-box{
    background: url(../assets/images/list-icon.png) right center / .16rem .26rem no-repeat;
    padding-right: .5rem;
  }
}
</style>
