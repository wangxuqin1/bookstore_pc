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
  listMenu: {
    url: '/pc/manage/menu/listMenu',
    method: 'post'
  },
  addMenu: {
    url: '/pc/manage/menu/addMenu',
    method: 'post'
  },
  getMenu: {
    url: '/pc/manage/menu/getMenu',
    method: 'post'
  },
  updateMenu: {
    url: '/pc/manage/menu/updateMenu',
    method: 'post'
  },
  deleteMenu: {
    url: '/pc/manage/menu/deleteMenu',
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
