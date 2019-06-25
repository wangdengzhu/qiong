<template>
  <div></div>
</template>
<script>
import { Indicator } from 'mint-ui'
import {getQueryParam} from '@/utils/common'
export default {
  data () {
    return {

    }
  },
  methods: {

  },
  beforeCreate () {
    Indicator.open('加载中')
  },
  mounted () {
    let qs = getQueryParam(location.href)
    const code = qs('code')
    const state = qs('state')
    if (!code) {
      window.location.href = 'http://webapi.hnjmnet.com/api/wechat/user/authorize'
    } else {
      this.$get('/wechat/user/callback', {
        code,
        state
      }).then(res => {
        if (res.ret === 0) {
          localStorage.setItem('openId', res.data.openId)
          if (res.data.newUser) {
            this.$store.commit('SAVE_USERINFO', Object.assign({}, {nickname: res.data.nickName}))
            this.$router.push({
              path: './introduce',
              query: {
                to: 'user'
              }
            })
          } else {
            if (res.data.userInfo) {
              this.$store.commit('SAVE_USERINFO', res.data.userInfo)
            }
            localStorage.setItem('token', res.data.token)
            this.$router.push({
              path: './introduce',
              query: {
                to: 'index'
              }
            })
          }
          // {ret:0,data:{newUser:true,openId:ss,nickName:ee,headImgUrl:sss}}
          // {ret:0,data:{newUser:false,openId:ss,token:ee,userInfo:{id:eee,...}}}
        }
      })
    }
  }
}
</script>
<style lang="scss" scope>

</style>
