<template>
  <div class="counter-wrap">
    <mt-header :title="this.typeText + '的礼物'">
      <div @click="$router.go(-1)" slot="left">
        <mt-button icon="back"></mt-button>
      </div>
    </mt-header>
    <section class="greet-wrap">
      <ul>
        <li class="list" v-for="(item,i) in greetList" :key="i">
          <div class="list-left">{{item.placeOrderTime}}</div>
          <div class="list-right">
            <span>{{typeText}}</span>
            <img :src="item.imageUrl" alt="">
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import { Indicator, Toast } from 'mint-ui'
export default {
  data () {
    return {
      type: 1,
      typeText: '',
      greetList: []
    }
  },
  methods: {
    init () {
      let token = localStorage.getItem('token')
      const data = {
        'APP-Token': token,
        type: this.type == 1 ? 'other' : 'my',
        viewUserId: this.$route.query.id,
        direction: this.type == 1 ? 'from' : 'to'
      }
      Indicator.open()
      this.$get('/user/greeting', data).then(res => {
        Indicator.close()
        if (res.ret === 0) {
          this.greetList = res.data.records
        }
      })
    }
  },
  mounted () {
    this.type = this.$route.query.type // 1: 收到； 2: 送出
    this.typeText = this.$route.query.type == 1 ? '收到' : '送出'
    this.init()
  }
}
</script>
<style lang="scss">
.counter-wrap{
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: #fff;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1111;
}
.greet-wrap{
  padding: .01rem 0;
  font-size: .28rem;
  background: #d8d8d8;
  .list{
    margin: .1rem;
    padding: .4rem .3rem;
    width: 6.7rem;
    background: #fff;
    display: flex;
    justify-content: space-between;
    .list-right{
      img{
        width: .4rem;
        height: .4rem;
        vertical-align: middle;
      }
      span{
        vertical-align: middle;
      }
    }
  }
}

</style>
