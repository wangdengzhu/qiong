<template>
  <div class="gift-wrapper">
     <mt-navbar v-model="selected">
      <mt-tab-item id="1">收到的礼物</mt-tab-item>
      <mt-tab-item id="2">送出的礼物</mt-tab-item>
    </mt-navbar>
    <div class="list list-box" @click="toCash">
      <p class="font32">去提现</p>
      <p>共收到3个礼物，合计30元</p>
    </div>
    <!-- tab-container -->
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="1">
        <div class="list list-box" @click="toOrderDetail">
          <div class="sugest">
            <div>2019年5月15日</div>
            <div>
              <span>送出</span>
              <img src="../assets/images/beer-icon.png">
            </div>
          </div>
        </div>
        <div class="list">
          <div class="sugest">
            <div>2019年5月15日</div>
            <div>
              <span>打招呼</span>
              <img src="../assets/images/rose.png">
            </div>
          </div>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <mt-cell v-for="n in 4" :title="'测试 ' + n"  :key="n"/>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selected: '1'
    }
  },
  methods: {
    toOrderDetail () {
      this.$router.push({
        path: '/order/orderdetail'
      })
    },
    toCash () {
      this.$router.push({
        path: '/cash'
      })
    }
  },
  mounted () {
    this.gift = this.$route.query.gift
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
    background-size: .32rem .52rem;
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
    background: url(../assets/images/list-icon.png) right center no-repeat;
    padding-right: .5rem;
  }
}
</style>
