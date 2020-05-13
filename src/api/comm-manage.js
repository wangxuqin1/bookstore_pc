import req from '../fetch/index.js'

const config = {
  listClassOne: {
    url: '/pc/manage/goods/listClassOne',
    method: 'post'
  },
  listClassSecond: {
    url: '/pc/manage/goods/listClassSecond',
    method: 'post'
  },
  addGoods: {
    url: '/pc/manage/goods/addGoods',
    method: 'post'
  },
  getGoods: {
    url: '/pc/manage/goods/getGoods',
    method: 'post'
  },
  updateGoods: {
    url: '/pc/manage/goods/updateGoods',
    method: 'post'
  },
  listGoods: {
    url: '/pc/manage/goods/listGoods',
    method: 'post'
  },
  deleteGoods: {
    url: '/pc/manage/goods/deleteGoods',
    method: 'post'
  },
  updateGoodsStatus: {
    url: '/pc/manage/goods/updateGoodsStatus',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
