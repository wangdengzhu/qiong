class IM {
  constructor (wsURL = '') {
    this.ws = null
    this.wsURL = wsURL
    this.to = ''
    this.from = ''
    this.stores = {}
    // this.init()
  }
  init (param = {}) {
    this.wsURL = param.wsURL
    this.createWebsocket()
  }
  createWebsocket () {
    this.ws = new WebSocket(this.wsURL);
    ['open', 'message', 'error', 'close'].forEach(event => {
      this.ws[`on${event}`] = this[`${event}Handler`].bind(this)
    })
  }

  on (event, handler) {
    let store = this.stores[event]
    if (store) {
      return
    }
    this.stores[event] = handler
  }

  openHandler () {
    console.log('open')
    const openStore = this.stores['open']
    openStore && openStore()
  }

  messageHandler (evt) {
    console.log('message')
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
}
export default IM
