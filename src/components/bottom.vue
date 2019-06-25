<template>
    <div>
      <mt-tabbar fixed>
        <mt-tab-item id="home" @click.native="linkTo('index')">
          <img v-if="active1" slot="icon" src="../assets/images/home-icon1.png">
          <img v-else slot="icon" src="../assets/images/home-icon.png">
          大厅
        </mt-tab-item>
        <mt-tab-item class="relative" id="chat" @click.native="linkTo('chatlist')">
          <span class="badge" v-show="hasMessage"></span>
          <img v-if="active2" slot="icon" src="../assets/images/chat-icon1.png">
          <img v-else slot="icon" src="../assets/images/chat-icon.png">
          消息
        </mt-tab-item>
        <mt-tab-item class="relative" id="message" @click.native="linkTo('message')">
          <span class="badge number" v-show="hasMessage">6</span>
          <img v-if="active3" slot="icon" src="../assets/images/message-icon1.png">
          <img v-else slot="icon" src="../assets/images/message-icon.png">
          留言板
        </mt-tab-item>
        <mt-tab-item id="user" @click.native="linkTo('profile/profile')">
          <img v-if="active4" slot="icon" src="../assets/images/user-icon1.png">
          <img v-else slot="icon" src="../assets/images/user-icon.png">
          我的
        </mt-tab-item>
      </mt-tabbar>
    </div>
</template>

<script>
export default {
  data () {
    return {
      hasMessage: !0,
      active1: !1,
      active2: !1,
      active3: !1,
      active4: !1
    }
  },
  methods: {
    linkTo (param) {
      this.$router.push({
        path: '/' + param
      })
    }
  },
  mounted () {
    const param = this.$route.name
    switch (param) {
      case '大厅' :
        this.active1 = !0
        break
      case '消息列表' :
        this.active2 = !0
        break
      case '留言板' :
        this.active3 = !0
        break
      case '我的' :
        this.active4 = !0
        break
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
