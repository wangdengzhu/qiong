<template>
  <div class="chatlist-wrap">
    <moveleft :list="list"></moveleft>
    <bottom></bottom>
  </div>
</template>

<script>
import bottom from '@/components/bottom'
import moveleft from '@/components/moveleft'
import { Indicator, Toast } from 'mint-ui'
export default {
  components: { bottom, moveleft },
  data () {
    return {
      list: []
    }
  },
  methods: {
    init () {
      Indicator.open()
      let token = localStorage.getItem('token')
      this.$get('/userMessage/chatList', {
        'APP-Token': token,
        pageNum: 1,
        pageSize: 30
      }).then(res => {
        Indicator.close()
        if (res.ret === 0) {
          this.list = res.data.records
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
.chatlist-wrap {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: #fff;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
  font-size: 0.3rem;
}
</style>
