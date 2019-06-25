<template>
  <div class="con" @touchend="toIndex">
    <div class="box">
      <img src="../assets/images/stranger.png" alt="">
      <div>
        <img src="../assets/images/logo-index.png" alt="">
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data () {
    return {
    }
  },
  methods: {
    linkTo (to) {
      if (to == 'user') {
        this.$router.push({
          path: './user'
        })
      } else {
        this.$router.push({
          path: './index'
        })
      }
    },
    toIndex () {
      this.linkTo(this.$route.query.to)
    }
  },
  mounted () {
    setTimeout(() => {
      this.linkTo(this.$route.query.to)
    }, 4000)
  }
}
</script>
<style lang="scss" scope>
  .con{
    padding-top: 3rem;
    text-align: center;
    background: #fff;
    .box{
      width: 6rem;
      margin: 0 auto;
      padding: .4rem 0;
      border-radius: .08rem;
      color: #333;
      text-align: center;
      &>img{
        width: 6rem;
      }
      div img{
        width: 5rem;
      }
    }
  }
</style>
