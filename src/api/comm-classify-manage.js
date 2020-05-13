import req from '../fetch/index.js'

const config = {
  addGoodsClass: {
    url: '/pc/manage/goodsclassification/addGoodsClass',
    method: 'post'
  },
  getGoodsClass: {
    url: '/pc/manage/goodsclassification/getGoodsClass',
    method: 'post'
  },
  updateGoodsClass: {
    url: '/pc/manage/goodsclassification/updateGoodsClass',
    method: 'post'
  },
  deleteGoodsClass: {
    url: '/pc/manage/goodsclassification/deleteGoodsClass',
    method: 'post'
  },
  listGoodsClass: {
    url: '/pc/manage/goodsclassification/listGoodsClass',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
