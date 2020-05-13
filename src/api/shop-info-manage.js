import req from '../fetch/index.js'

const config = {
  addStore: {
    url: '/pc/manage/store/addStore',
    method: 'post'
  },
  getStore: {
    url: '/pc/manage/store/getStore',
    method: 'post'
  },
  updateStore: {
    url: '/pc/manage/store/updateStore',
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
  deleteStore: {
    url: '/pc/manage/store/deleteStore',
    method: 'post'
  },
  listStore: {
    url: '/pc/manage/store/listStore',
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
