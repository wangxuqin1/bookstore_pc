import req from '../fetch/index.js'

const config = {
  setDisplayCount: {
    url: '/pc/manage/hotGoods/setDisplayCount',
    method: 'post'
  },
  addHotGoods: {
    url: '/pc/manage/hotGoods/addHotGoods',
    method: 'post'
  },
  getHotGoods: {
    url: '/pc/manage/hotGoods/getHotGoods',
    method: 'post'
  },
  updateHotGoods: {
    url: '/pc/manage/hotGoods/updateHotGoods',
    method: 'post'
  },
  listHotGoods: {
    url: '/pc/manage/hotGoods/listHotGoods',
    method: 'post'
  },
  deleteHotGoods: {
    url: '/pc/manage/hotGoods/deleteHotGoods',
    method: 'post'
  },
  listGoods: {
    url: '/pc/manage/rotationChart/listGoods',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
