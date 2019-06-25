<template>
    <div class="text-wrapper">
      <mt-header title="设置个性签名">
        <mt-button @click="$router.go(-1)" slot="left">取消</mt-button>
        <mt-button @click="saveText" class="btn-sure" :class="sure ? 'sure' : ''" slot="right">完成</mt-button>
      </mt-header>
      <mt-field :attr="{ maxlength: 30 }" label="" type="textarea" rows="3" placeholder="请输入内容" v-model="text"></mt-field>
    </div>
</template>

<script>
import { Indicator, Toast } from 'mint-ui'
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      text: ''
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    sure () {
      if (!this.text.length) {
        return !1
      }
      return !0
    }
  },
  methods: {
    saveText () {
      if (!this.text.length) {
        return false
      }
      Indicator.open('保存中...')
      let token = localStorage.getItem('token')
      this.$post('/user/modify?APP-Token=' + token, {introduction: this.text}).then(res => {
        Indicator.close()
        Toast(res.msg)
        if (res.ret === 0) {
          this.$store.commit('SAVE_USERINFO', Object.assign({}, this.userInfo, {introduction: this.text}))
          setTimeout(() => {
            this.$router.go(-1)
          }, 3000)
        }
      })
    }
  },
  mounted () {
    this.text = decodeURIComponent(this.$route.query.text) || ''
  }

}
</script>
<style lang="scss" scoped>
@import '../../assets/css/mixins.css';
.text-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 101;
  background-color: #f5f5f5;
  font-size: .3rem;
  .btn-sure{
    background: #3bae56;
    color: #fff;
    width: 1rem;
    height: 30px;
    opacity: .5;
    &.sure{
      opacity: 1;
    }
  }
}
.mint-header{
  background: #f5f5f5;
  color: #333;
}
</style>
