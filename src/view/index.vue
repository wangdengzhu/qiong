<template>
  <div>
    <my-header title="~~~"></my-header>
    <section class="content">
        <div class="my-input">
            <input type="text" placeholder="Please enter what you want" @keyup.enter="inputEnter">
        </div>
        <ul class="item">
            <li v-for="(val,index) of item" :key="index">
              <label>{{val.v}}</label>
              <button @click="remove(index)">x</button>
            </li>
        </ul>
    </section> 
  </div>
</template>

<script>
import storage from "@/utils/store";
import MyHeader from "@/components/head/head.vue";
export default {
  components: {
    MyHeader
  },
  data() {
    return {
      toIndex: 0,
      item: []
    };
  },
  methods: {
    inputEnter(e) {
      let val = e.target.value;
      storage.set(this.toIndex, val);
      this.item.push({ i: this.toIndex, v: val });
      this.toIndex++;
    },
    remove(i){
      this.item.splice(i,1);
      
      this.toIndex--;
      storage.remove(this.toIndex);
    }
  },
  mounted() {
    // let obj = storage.getAll();
    // this.toIndex = obj.length;
    // let len = this.toIndex;
    // if (this.toIndex > 0) {
    //   for (let i = 0; i < len; i++) {
    //     this.item[i] = obj[i];
    //   }
    // }
    // this.item = obj;
  }
};
</script>
<style scoped>
.content {
  font-size: 0.36rem;
}
.my-input input {
  margin: 0.5rem 0.5rem 0;
  padding-left: 0.5rem;
  width: 6rem;
  height: 0.8rem;
  border: 1px solid #f60;
}
.item{
  margin: .2rem .5rem;
  display:flex;
  flex-flow: wrap;
  justify-content: space-between;
}
.item li{
  width: 2.85rem;
  padding: 0 .2rem;
  display:flex;
  justify-content: space-between;
}
.item li button{
  /* margin-left: 1rem; */
  width: .8rem;
  font-size: .5rem;
  border: 1px solid #ddd;
}
</style>
