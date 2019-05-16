import { fetch, post } from '@/utils/fetch'

const getPath = (method) => {
  const path = '/user/m/'
  return path + method
}

const sendCode = (phone) => {
  if (!phone) {
    return
  }
  return post(getPath('getcode'), {
    mobile: phone,
    smstype: 1
  })
}

const login = (data) => {
  if (typeof data !== 'object') {
    return
  }
  return post(getPath('login'), data)
}

const getUsrInfo = () => fetch(getPath('getuserinfo'))

const saveUsrInfo = (data) => post(getPath('saveuserinfo'), data)

const saveUsrPhoto = (data) => post(getPath('saveuserphoto'), data)

export default {
  sendCode,
  login,
  getUsrInfo,
  saveUsrInfo,
  saveUsrPhoto
}
