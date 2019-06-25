<template>
  <div id="app">
    <giftshow></giftshow>
    <router-view/>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import { mapState } from 'vuex'
import Vue from 'vue'
import VueJsonp from 'vue-jsonp'
import { Indicator, Toast } from 'mint-ui'
import store from '@/store/'
import storage from '@/utils/store'
import giftshow from '@/components/giftshow'
Vue.use(VueJsonp)
export default {
  name: 'App',
  components: {giftshow},
  data () {
    return {
      lng: '',
      lat: '',
      curlng: '',
      curlat: '',
      timer: null
    }
  },
  computed: {
    ...mapState({
      barInfo: state => state.user.barInfo
    })
  },
  methods: {
    // 离开酒吧请求接口
    offline () {
      let token = localStorage.getItem('token')
      // this.$get('/mch/tab/offline', {'APP-Token': token}).then(res => {
      //   if (res.ret === 0) {
      //     Toast('您已经离开酒吧')
      //     // 获取酒吧信息
      //     this.$get('/mch/current', {'APP-Token': token}).then(res => {
      //       if (res.ret === 0) {
      //         store.commit('SAVE_BARINFO',{})
      //         this.$router.push({
      //           path: './index'
      //         })
      //       }
      //     })
      //     clearTimeout(this.timer)
      //   }
      // })
    },
    getDistance (lng, lat) {
      // 测距需要的两点
      var point1 = new BMap.Point(lng, lat)
      var point2 = new BMap.Point(this.lng, this.lat)

      // 进行测距
      var distance = BMapLib.GeoUtils.getDistance(point1, point2)
      return distance
    },
    // 转换成百度经纬度
    getBaiduPosition (lng, lat) {
      var url = 'http://api.map.baidu.com/geoconv/v1/?coords=' + lng + ',' + lat + '&from=1&to=5&ak=eV2fEYCGBeIKB4p3jIblRqGcxOr4vu67'
      Vue.jsonp(url).then(data => {
        this.curlng = data.result[0].x// 经度
        this.curlat = data.result[0].y// 纬度
        if (this.getDistance(this.curlng, this.curlat) > 200) {
          this.offline()
        }
      })
    },
    getLocation (res) {
      const {appId, timestamp, nonceStr, signature} = res
      wx.config({
        // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: appId,
        timestamp: timestamp,
        nonceStr: nonceStr,
        signature: signature,
        jsApiList: [
          // 所有要调用的 API 都要加到这个列表中
          'getLocation'
        ]
      })
      wx.ready(() => {
        wx.checkJsApi({
          jsApiList: [
            'getLocation'
          ],
          success: function (res) {
            if (res.checkResult.getLocation == false) {
              Toast('你的微信版本太低，不支持微信JS接口，请升级到最新的微信版本！')
            }
          }
        })
        wx.error(function (res) {
          Toast('接口调取失败')
        })
        wx.getLocation({
          success: res => {
            this.curlat = res.latitude // 纬度，浮点数，范围为90 ~ -90
            this.curlng = res.longitude // 经度，浮点数，范围为180 ~ -180。
            this.getBaiduPosition(this.curlng, this.curlat)
          },
          cancel: function (res) {
            Toast('用户拒绝授权获取地理位置')
          }
        })
      })
    }
  },
  mounted () {
    this.$get('/wechat/config', {
      url: location.href.split('#')[0]
    }).then(res => {
      storage.set('wxconfig', res)
      this.getLocation(res)
    })
    this.timer = setInterval(() => {
      console.log(this.barInfo.bar)
      if (this.barInfo.bar && this.barInfo.bar.lat) {
        this.lng = this.barInfo.bar.lng
        this.lat = this.barInfo.bar.lat
        let wxconfig = storage.get('wxconfig')
        this.getLocation(wxconfig)
      }
    }, 10000)
  }
}
</script>

<style>
  @import './assets/css/common';
</style>
