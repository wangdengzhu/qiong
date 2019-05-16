<template>
    <div>
      <mt-tabbar fixed>
        <mt-tab-item id="home" @click.native="linkTo('index')">
          <img slot="icon" src="../assets/images/home-icon.png">
          首页
        </mt-tab-item>
        <mt-tab-item class="relative" id="message" @click.native="linkTo('chat')">
          <span class="badge number" v-show="hasMessage">6</span>
          <img slot="icon" src="../assets/images/message-icon.png">
          留言板
        </mt-tab-item>
        <mt-tab-item class="relative" id="chat" @click.native="linkTo('chatlist')">
          <span class="badge" v-show="hasMessage"></span>
          <img slot="icon" src="../assets/images/chat-icon.png">
          消息
        </mt-tab-item>
        <mt-tab-item id="user" @click.native="linkTo('profile/profile')">
          <img slot="icon" src="../assets/images/user-icon.png">
          我的
        </mt-tab-item>
      </mt-tabbar>
    </div>
</template>

<script>
export default {
  data () {
    return {
      hasMessage: !0
    }
  },
  methods: {
    linkTo (param) {
      this.$router.push({
        path: '/' + param
      })
    }
  }
}
</script>
<style scoped lang="scss">
.relative{
  position: relative;
}
.badge{
  padding: 5px;
  background: #fd5050;
  border-radius: 50%;
  position: absolute;
  top: .12rem;
  right: .6rem;
}
.number{
  padding: .04rem .06rem;
  font-size: .24rem;
  color: #fff;
  left: 1.05rem;
  right: auto;
  border-radius: .2rem;
  text-align: center;
  min-width: .2rem;
}
</style>
