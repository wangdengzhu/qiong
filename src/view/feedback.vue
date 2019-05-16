<template>
  <div class="profile-wrap">
    <section class="user-con">
      <div class="user-box2 flex">
        <p class="feedback fd1">反馈类型：</p>
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="ht20"></div>
      <div class="user-box2">
        <p>反馈内容：</p>
        <mt-field label="" placeholder="请输入反馈内容" type="textarea" rows="4" v-model="content"></mt-field>
      </div>
      <div class="ht20"></div>
      <div class="user-box2">
        <p>添加图片：</p>
        <uploader @getFiles='getImageList' @removeFiles='removeImage'></uploader>
      </div>
      <div class="ht20"></div>
      <mt-field label="" placeholder="请留下您的联系方式" v-model="phone"></mt-field>
      <div class="ht20"></div>
      <mt-button type="primary" size="large">提交</mt-button>
    </section>
    <bottom></bottom>
  </div>
</template>

<script>
import bottom from '@/components/bottom'
import uploader from '@/components/Upload'
export default {
  components: {bottom, uploader},
  data () {
    return {
      phone: '',
      content: '',
      imgList: [], // 已上传的图片集合
      FilecodeList: [],
      isSubmit: false,
      options: [{
        value: '101',
        label: '支付问题'
      }, {
        value: '102',
        label: '功能异常'
      }, {
        value: '103',
        label: '产品建议'
      }, {
        value: '104',
        label: '其他'
      }],
      value: ''
    }
  },
  methods: {
    getImageList (files) {
      this.$nextTick(() => {
        for (let i = 0, len = files.length; i < len; i++) {
          this.imgList.push(files[i].src.split('base64,')[1])
          // 上传图片
          //   this._getFileCode({
          //     Base64Str: files[i].src.split("base64,")[1],
          //     AttachmentType: this.$enums.AttachmentType.Activity
          //   });
        }
      })
    },
    // 删除图片
    removeImage (index) {
      this.imgList.splice(index, 1)
    },
    toMyGift () {
      this.$router.push({
        path: '/mygift'
      })
    }
  },
  created () {

  }
}
</script>
<style lang="scss">
.profile-wrap{
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: #f0f0f0;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
}
.user-con{
  margin-bottom: 1.2rem;
  font-size: .3rem;
  background-color: #fff;
  .user-box1{
    width: 7.3rem;
    padding: .4rem 0 .6rem;
    text-align: center;
    img{
      width: 2rem;
      height: 2rem;
      margin-bottom: .2rem;
    }
  }
  .user-box2{
    width: 7.1rem;
    margin: auto;
    padding: .2rem;
    p{
      margin: 0 0 .2rem;
      padding-left: .45rem;
      background: url(../assets/images/label-icon.png) left center no-repeat;
      background-size: contain;
    }
    .feedback{
      background-image: url(../assets/images/sugest-icon.png);
      background-size: .45rem;
    }
    .fd1{
      line-height: 40px;
    }
  }
  .list-box{
    margin-right: .2rem;
    padding: .4rem .2rem;
    background: url(../assets/images/list-icon.png) right center no-repeat;
    background-size: .32rem .52rem;
    div{
      padding-left: .5rem;
    }
    .gift{
      background: url(../assets/images/gift-icon.png) left center no-repeat;
      background-size: .45rem;
    }
    .sugest{
      background: url(../assets/images/sugest-icon.png) left center no-repeat;
      background-size: .45rem;
    }
  }
}

</style>
