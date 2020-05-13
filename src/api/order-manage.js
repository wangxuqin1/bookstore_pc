import req from '../fetch/index.js'

const config = {
  listOrder: {
    url: '/pc/manage/order/listOrder',
    method: 'post'
  },
  getOrderDetails: {
    url: '/pc/manage/order/getOrderDetails',
    method: 'post'
  },
  updateOrderState: {
    url: '/pc/manage/order/updateOrderState',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
