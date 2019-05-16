<template>
  <div class="counter-wrap">
    <mt-header title="收到的招呼">
      <router-link to="/userinfo" slot="left">
        <mt-button>返回</mt-button>
      </router-link>
    </mt-header>
    <section class="greet-wrap">
      <ul>
        <li class="list" v-for="(item,i) in 12" :key="i">
          <div class="list-left">2019年5月9日 21:50</div>
          <div class="list-right">
            <span>送出</span>
            <img src="../assets/images/love-icon.png" alt="">
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import IM from '@/utils/im'
export default {
  data () {
    return {
      im: null
    }
  },
  methods: {
    
  },
  mounted () {
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
