<template>
  <div class="chatlist-wrap" @click="showGreet = !1">
    <moveleft></moveleft>
    <bottom></bottom>
  </div>
</template>

<script>
import bottom from "@/components/bottom";
import moveleft from "@/components/moveleft";
import { MessageBox } from 'mint-ui';
export default {
  components: { bottom, moveleft},
  data() {
    return {
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      swipeX: false,
      swipeY: false,
      expansion: false
    };
  },
  methods: {
    toChat() {
      this.$router.push({
        path: "/chat"
      });
    }
  },
  created() {
  }
};
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
