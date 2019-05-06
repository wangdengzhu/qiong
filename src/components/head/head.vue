<template>
    <div @click="toDo">
        {{ title }}
    </div>
</template>

<script>
export default {
  props: ["title"],
  data() {
    return {};
  },
  methods: {
      toDo(){
          alert(111);
      }
  }
};
</script>
<style scoped>
div {
  width: 7.5rem;
  height: 1rem;
  margin: 0;
  padding: 0;
  background: #f70;
  text-align: center;
  font-size: 0.32rem;
  line-height: 1rem;
}
</style>
