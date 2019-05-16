<template>
  <div class="con" :style="{height:height+'px'}">
    <div class="box">
      <p>欢迎您进入遇TA，在这里您可以</p>
      <p>尽情的享受撩与被撩的乐趣！</p>
      <p>喜欢就去撩吧！</p>
      <p>没准就成功了呢！</p>
    </div>
    <mt-button type="default" size="small" @click="toIndex">跳过</mt-button>
  </div>
</template>

<script>

export default {
  data () {
    return {
      height: 0
    }
  },
  methods: {
    toIndex () {
      this.$router.push({
        path: './user'
      })
    }
  },
  mounted () {
    const body = document.querySelector('html')
    this.height = body.clientHeight - 200
  }
}
</script>
<style lang="scss" scope>
  .con{
    padding-top: 200px;
    text-align: center;
    background: #ffa8ac;
    background-image: radial-gradient(circle at center top,#f38aee,#00b8ff);
    .box{
      width: 6rem;
      margin: 0 auto;
      padding: .4rem 0;
      border: 1px solid #eee;
      box-shadow: #eee 0px 0px 10px;
      border-radius: .08rem;
      color: #24f500;
      p{
        font-size: .32rem;
        text-align: center;
        line-height: .6rem;
      }
    }
  }
</style>
