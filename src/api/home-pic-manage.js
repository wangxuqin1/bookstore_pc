import req from '../fetch/index.js'

const config = {
  // portExport: {
  //   url: 'http://p2991w6815.oicp.vip',
  //   method: 'post',
  //   fileConfig: {
  //     type: 'file',
  //     fileName: '销售激励报表'
  //   }
  // },
  listRotationChart: {
    url: '/pc/manage/rotationChart/listRotationChart',
    method: 'post'
  },
  addRotationChart: {
    url: '/pc/manage/rotationChart/addRotationChart',
    method: 'post'
  },
  listGoods: {
    url: '/pc/manage/rotationChart/listGoods',
    method: 'post'
  },
  getRotationChart: {
    url: '/pc/manage/rotationChart/getRotationChart',
    method: 'post'
  },
  deleteRotationChart: {
    url: '/pc/manage/rotationChart/deleteRotationChart',
    method: 'post'
  },
  updateRotationChartState: {
    url: '/pc/manage/rotationChart/updateRotationChartState',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
