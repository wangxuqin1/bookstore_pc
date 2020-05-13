import req from '../fetch/index.js'

const config = {
  addDriver: {
    url: '/pc/manage/driver/addDriver',
    method: 'post'
  },
  getDriver: {
    url: '/pc/manage/driver/getDriver',
    method: 'post'
  },
  updateDriver: {
    url: '/pc/manage/driver/updateDriver',
    method: 'post'
  },
  listProvince: {
    url: '/pc/manage/store/listProvince',
    method: 'post'
  },
  listCity: {
    url: '/pc/manage/store/listCity',
    method: 'post'
  },
  listArea: {
    url: '/pc/manage/store/listArea',
    method: 'post'
  },
  listDriver: {
    url: '/pc/manage/driver/listDriver',
    method: 'post'
  },
  deleteDriver: {
    url: '/pc/manage/driver/deleteDriver',
    method: 'post'
  },
  userMessage: {
    url: '/pc/manage/user/userMessage',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
