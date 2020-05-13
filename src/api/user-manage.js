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
  getTableData: {
    url: '/pc/manage/user/listUser',
    method: 'post'
  },
  addUser: {
    url: '/pc/manage/user/addUser',
    method: 'post'
  },
  getUser: {
    url: '/pc/manage/user/getUser',
    method: 'post'
  },
  updateUser: {
    url: '/pc/manage/user/updateUser',
    method: 'post'
  },
  deleteUser: {
    url: '/pc/manage/user/deleteUser',
    method: 'post'
  },
  upload: {
    url: '/pc/image/upload',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
