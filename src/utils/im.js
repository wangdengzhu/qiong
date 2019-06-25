import store from '@/store/'
class IM {
  constructor (wsURL = '') {
    this.ws = null
    this.wsURL = wsURL
    this.to = ''
    this.from = ''
    this.chatType = 2
    this.group_id = ''
    this.stores = {}
    // this.init()
  }

  /**
   *初始化服务
   * @param chatType
   * @param userId
   * @returns {Promise<any>}
   */
  getSevicer (chatType, userId, groupId) {
    return new Promise((resolve, reject) => {
      let token = localStorage.getItem('token') // 获取用户token,8659f802-b012-49eb-8094-8566c50c22b1
      // let user = store.getters.userInfo // 获取用户信息
      // let groupId = 'a91ed8049a6043f4b5e5992446f84b44'// 组ID，酒吧ID
      // let userId = this.from // 用户ID,1002
      // 用户登录成功返回TOKEN
      let wsURL = 'ws:47.111.41.121:28888?token=' + token + '&groupId=' + groupId
      this.token = token
      this.from = userId
      this.group_id = groupId // 群组ID
      this.chatType = chatType// 聊天类型
      // 初始化WS
      this.init({wsURL, from: this.from, chatType: chatType})
      resolve()
    })
  }
  init (param = {}) {
    this.wsURL = param.wsURL
    this.from = param.from
    this.chatType = param.chatType
    this.createWebsocket()
  }
  createWebsocket () {
    this.ws = new WebSocket(this.wsURL);
    ['open', 'message', 'error', 'close'].forEach(event => {
      this.ws[`on${event}`] = this[`${event}Handler`].bind(this)
    })
    console.info('create ws .....wsURL->' + this.wsURL)
  }

  on (event, handler) {
    let store = this.stores[event]
    if (store) {
      return
    }
    this.stores[event] = handler
  }

  openHandler () {
    const openStore = this.stores['open']
    openStore && openStore()
    console.info('ws openHandler ws .....')
  }

  messageHandler (evt) {
    console.log('rec message->' + JSON.stringify(evt.data))
    const messgaeStore = this.stores['message']
    messgaeStore && messgaeStore(JSON.parse(evt.data))
  }

  errorHandler () {
    console.log('error')
    const errorStore = this.stores['error']
    errorStore && errorStore()
  }

  closeHandler () {
    console.log('close')
    const closeStore = this.stores['close']
    closeStore && closeStore()
  }
  send (msgType, data, isRealSend, extras) {
    const enitity = this.getMsgEntity(msgType, data)
    let message = {
      type: 'message',
      token: this.token,
      from: this.from,
      to: this.to,
      cmd: 11,
      ...enitity
    }
    if (this.chatType === 1) { // 群聊
      message = {
        type: 'message',
        token: this.token,
        from: this.from,
        cmd: 11,
        group_id: this.group_id,
        extras: extras, // 扩展字段：JSON格式
        ...enitity
      }
    } else if (this.chatType === 2) { // 私聊
      message = {
        type: 'message',
        token: this.token,
        from: this.from,
        to: this.to,
        cmd: 11,
        extras: extras, // 扩展字段：JSON格式
        ...enitity
      }
    }

    if (this.ws && isRealSend) {
      console.log('send message->' + JSON.stringify(message))
      this.ws.send(JSON.stringify(message))
    } else {
      console.log('send message error ->' + JSON.stringify(message))
    }
    return message
  }
  heartbeat () {
    let heartbeat = JSON.stringify({
      type: 'checklogin',
      cmd: 12,
      createTime: +new Date(),
      from: this.from,
      to: this.to,
      token: this.token
    })
    this.ws.send(heartbeat)
    // if (this.canUse()) {
    //   this.ws.send(heartbeat)
    // }
  }
  destory (isSendEndMsg = !0) {
    if (isSendEndMsg) {
      let message = '下线'
      this.ws.send(JSON.stringify(message))
    }
    this.ws.close()
    this.ws = null
  }
  getMsgEntity (msgType, data) {
    const state = store.state
    let obj = {}
    obj.chatType = this.chatType // 0=未知 1=公聊 2=私聊
    obj.msgType = msgType // 0=文本 1=图片 2=语音 3=视频 4=音乐 5=图文 6=订单（礼物、打招呼等） 7=表情
    obj.createTime = +new Date()
    obj.avatar = state.user.userInfo ? state.user.userInfo.avatar : ''
    obj.nickname = state.user.userInfo ? state.user.userInfo.nickname : ''
    switch (msgType) {
      case 0:
        obj.content = data
        break
      case 1:
        obj.content = data
        break
      case 6:
        obj.content = {
          image: data.image,
          giftName: data.giftName,
          id: data.id,
          giftPrice: data.giftPrice
        }
        break
      default:;
    }
    return obj
  }
}
export default IM
