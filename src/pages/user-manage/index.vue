<template>
  <div>
    <i-search ref="isearch" :model="formData" @search="fetch" @reset="reset">
      <el-form-item label="姓名" prop="userName">
        <el-input v-model="formData.userName"></el-input>
      </el-form-item>
      <el-form-item label="账号" prop="userAccount">
        <el-input v-model="formData.userAccount"></el-input>
      </el-form-item>
       <el-form-item label="用户角色" prop="role">
          <el-select v-model="formData.role" placeholder="请选择用户角色">
            <el-option label="全部" value="0"></el-option>
            <el-option label="管理员" value="1"></el-option>
            <el-option label="店长" value="2"></el-option>
            <!-- <el-option
              v-for="(item, index) in roleOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option> -->
          </el-select>
        </el-form-item>
    </i-search>
    <i-table
    :toolbar="toolbar"
    :pageInfo="pageInfo"
    :tableData="tableData"
    :selectionShow="true"
    @handleSizeChange="handleSizeChange"
    @handleCurrentChange="handleCurrentChange"
    @select-change="handleSelectionChange">
      <el-table-column
       :show-overflow-tooltip="true"
       v-for="(item, index) in columnList"
       :key="index"
       :label="item.label"
       :prop="item.prop"
       align="center">
       <!-- :formatter="columnFormatter" -->
       </el-table-column>
    </i-table>
    <i-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      @dialog-before-close="dialogBeforeClose"
      @dialog-cancel="dialogCancel"
      @dialog-confirm="dialogConfirm">
      <el-form :model="dialogFormData" ref="form" :rules="formRules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户账号" prop="userAccount">
              <el-input v-model="dialogFormData.userAccount"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户姓名" prop="userName">
              <el-input v-model="dialogFormData.userName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
           <el-form-item label="用户性别" prop="sex">
              <el-select v-model="dialogFormData.sex" placeholder="请选择用户性别">
                <el-option label="男" value=1></el-option>
                <el-option label="女" value=0></el-option>
                 <!-- <el-option
                  v-for="(item, index) in sexlist"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option> -->
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input class="phone" v-model="dialogFormData.phone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户邮箱" prop="email">
              <el-input v-model="dialogFormData.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证" prop="idCard">
              <el-input class="idCard" v-model="dialogFormData.idCard"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
         <el-row>
          <el-col :span="12">
            <el-form-item label="用户密码" prop="userPwd">
              <el-input :show-password="true" v-model="dialogFormData.userPwd"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户角色" prop="role">
              <el-select v-model="dialogFormData.role" :disabled="isDisable" placeholder="请选择用户角色">
                <el-option label="管理员" value='1'></el-option>
                <el-option label="店长" value='2'></el-option>
                <!-- <el-option
                  v-for="(item, index) in roleOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option> -->
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="上传图片" ref="uploadElement" prop="imageUrl">
              <div class="a-upload">
                <input id="file" type="file" @change="inputChange($event)"/>点击上传
              </div>
              <!-- <div style="margin-left:150px"> -->
                <el-image
                v-show="isDisplay"
                style="width: 45px; height: 45px;border-radius:50%; display: inline-block; margin-left=20px"
                :src="dialogFormData.userImg"
                v-model="dialogFormData.userImg"
              >
              </el-image>
              <!-- </div> -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </i-dialog>
  </div>
</template>

<script>
import ISearch from '@/components/common/i-seaarch'
import ITable from '@/components/common/i-table'
import IDialog from '@/components/common/i-dialog'
import req from '@/api/user-manage.js'
import axios from 'axios'
export default {
  name: 'user-manage',
  components: {
    ISearch,
    ITable,
    IDialog
  },
  data () {
    return {
      value: '',
      usercode: '',
      imageUrl: '',
      isDisplay: false,
      isDisable: false,
      formData: {},
      formData2: {},
      getDataCode: {}, // 获取当前选框行数据对象
      dialogFormData: {
        userAccount: '',
        userPwd: '',
        userName: '',
        sex: null,
        phone: '',
        email: '',
        idCard: '',
        role: '',
        // imageUrl: '',
        userImg: ''
      },
      dialogVisible: false,
      dialogTitle: '新增用户',
      dialogType: 'addUser',
      userPassword: '',
      batchdeletion: '',
      pageInfo: {
        pageIndex: 1,
        pageSize: 5,
        total: 0
      },
      toolbar: [
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            this.dialogType = 'addUser'
            this.dialogTitle = '新增用户'
            this.dialogVisible = true
            // this.dialogFormData.userImg = ''
            this.isDisplay = false
            this.isDisable = false
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            if (this.getDataCode.length === undefined) {
              this.$message.error('请选择你要修改的用户')
            } else if (this.getDataCode.length === 1) {
              this.isDisplay = true
              this.isDisable = true
              this.dialogTitle = '修改用户'
              this.dialogVisible = true
              this.dialogType = 'updateUser'
              this.usercode = this.getDataCode[0].userCode
              this.getUsers()
              console.log(this.pageInfo)
            } else {
              this.$message.error('目前只能一次修改一个用户')
            }
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            if (this.getDataCode.length === undefined) {
              this.$message.error('请选择你要删除的用户')
            } else if (this.getDataCode.length >= 1) {
              this.$confirm('此操作将永久删除该用户,是否继续?').then(() => {
                console.log('this.getDataCode.length', this.getDataCode.length)
                for (let i = 0; i < this.getDataCode.length; i++) {
                  if (i < this.getDataCode.length - 1) {
                    console.log('i的值', i)
                    this.batchdeletion += this.getDataCode[i].userCode
                    this.batchdeletion += ','
                  } else {
                    console.log('i的值', i)
                    this.batchdeletion += this.getDataCode[this.getDataCode.length - 1].userCode
                  }
                }
                console.log('批量删除', this.batchdeletion)
                this.usercode = this.batchdeletion
                this.deleteData()
              })
            }
            // else {
            //   this.$message.error('目前只能一次删除一个用户')
            // }
          }
        }
      ],
      roleOptions: [
        {label: '管理员', value: '1'},
        {label: '店长', value: '2'}
      ],
      sexlist: [
        {label: '男', value: 1},
        {label: '女', value: 0}
      ],
      columnList: [
        {label: '用户编号', prop: 'userCode'},
        {label: '账号', prop: 'userAccount'},
        {label: '姓名', prop: 'userName'},
        {label: '角色', prop: 'role', disName: 'roleOptions'},
        {label: '性别', prop: 'sex', disName: 'sexlist'},
        {label: '手机', prop: 'phone'},
        {label: '邮箱', prop: 'email'},
        {label: '身份证', prop: 'idCard'}
      ],
      tableData: [
      ],
      formRules: {
        userAccount: [
          {required: true, message: '请输入用户账号', trigger: 'change'}
        ],
        // userPwd: [
        //   {required: true, message: '请输入用户密码', trigger: 'change'}
        // ],
        userName: [
          {required: true, message: '请输入用户姓名', trigger: 'change'}
        ],
        sex: [
          {required: true, message: '请选择用户性别', trigger: 'change'}
        ],
        role: [
          {required: true, message: '请选择用户角色', trigger: 'change'}
        ],
        phone: [
          {required: true, message: '请输入用户手机号', trigger: 'change'}
        ],
        email: [
          {required: true, message: '请输入用户邮箱', trigger: 'change'}
        ],
        idCard: [
          {required: true, message: '请输入用户身份证号', trigger: 'change'}
        ]
        // imageUrl: [
        //   {required: true, message: '请输入照片', trigger: 'change'}
        // ]
      }
    }
  },
  created () {
    this.fetch()
  },
  mounted () {
    this.pageInfo.total = this.tableData.length
    this.search()
  },
  methods: {
    fetch () {
      this.pageInfo.pageSize = 5
      this.pageInfo.pageIndex = 1
      this.search()
    },
    search () {
      req('getTableData', {
        ...this.formData,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageIndex
      }).then(data => {
        this.tableData = data.data.list
        this.pageInfo.pageIndex = data.data.pageNum
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.total = data.data.total
        console.log(data)
        data.data.list.forEach(item => {
          if (item.sex === 0) {
            item.sex = '女'
          } else {
            item.sex = '男'
          }
          if (item.role === 1) {
            item.role = '管理员'
          } else {
            item.role = '店长'
          }
        })
      })
    },
    getUsers () {
      req('getUser', {
        userCode: this.usercode
      }).then(data => {
        console.log('这里是查询数据', data)
        this.userPassword = data.data.userPwd
        this.dialogFormData = Object.assign({}, data.data)
      })
    },
    deleteData () {
      req('deleteUser', {
        userCode: this.usercode
      }).then(data => {
        this.fetch()
        this.$message.success(data.msg)
      })
    },
    inputChange (event) {
      let form = new FormData()
      let file = document.getElementById('file').files[0]
      console.log('files', file)
      form.append('file', file, file.name)
      form.append('access_token', JSON.parse(sessionStorage.getItem('userInfo')).access_token)
      axios({
        method: 'post',
        url: 'http://p2991w6815.oicp.vip/pc/image/upload',
        data: form,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(data => {
        console.log('data的值', data)
        // this.imageUrls = data.data.data
        this.imageUrls = data.data.data
        if (this.imageUrls) {
          this.dialogFormData.userImg = this.imageUrls
          console.log('图片路径', this.dialogFormData.userImg)
          this.isDisplay = true
        } else {
          this.isDisplay = false
        }
      })
    },
    reset () {
      console.log('重置按钮被点击了')
    },
    handleSizeChange (value) {
      this.pageInfo.pageSize = value
      this.search()
      console.log('每页多少条', value)
      // this.pageInfo.pageSize = value
    },
    handleCurrentChange (value) {
      this.pageInfo.pageIndex = value
      this.search()
      console.log('当前第几页', value)
    },
    handleSelectionChange (rows) {
      this.getDataCode = rows
      console.log('row的值', rows)
    },
    dialogCancel () {
      this.$refs.form.resetFields()
      this.dialogVisible = false
    },
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        console.log('valid的值：', valid)
        if (valid) {
          var phone = this.$refs.form.model.phone
          var phone2 = /^1[3|4|5|7|8]\d{9}$/
          var idCard = this.$refs.form.model.idCard
          var idCard2 = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
          var email = this.$refs.form.model.email
          var email2 = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
          var p = 1
          var i = 1
          var e = 1
          console.log('phone.length', phone.length)
          console.log('idCard.length', idCard.length)
          console.log('this.$refs.form', this.$refs.form)
          if (idCard2.test(idCard) && idCard.length === 18) {
            i = 1
          } else {
            i = 0
            this.$message.error('身份证格式错误,请重新输入')
          }
          if (phone2.test(phone) && phone.length === 11) {
            p = 1
          } else {
            this.$message.error('手机格式错误,请重新输入')
            p = 0
          }
          if (email2.test(email)) {
            e = 1
          } else {
            this.$message.error('邮箱格式错误,请重新输入')
            e = 0
          }
          console.log('p', p)
          console.log('i', i)
          if (i && p && e) {
            if (this.dialogType === 'addUser') {
              console.log('this.dialogFormData', this.dialogFormData)
              // this.dialogFormData.imageUrl = this.imageUrls
              req('addUser', {
                ...this.dialogFormData
              }).then(data => {
                console.log(data)
                if (data.code === 0) {
                  this.$message.success(data.msg)
                  this.fetch()
                  this.$refs.form.resetFields()
                  this.dialogVisible = false
                  // this.dialogFormData.userImg = null
                } else {
                  this.$message.error(data.msg)
                }
              })
            } else {
              if (this.userPassword === this.$refs.form.model.userPwd) {
                this.dialogFormData.userPwd = ''
              }
              this.dialogFormData.role = parseInt(this.dialogFormData.role)
              console.log(' ...this.dialogFormData', this.dialogFormData)
              req('updateUser', {
                ...this.dialogFormData
              }).then(data => {
                console.log(data)
                if (data.code === 0) {
                  this.$message.success(data.msg)
                  this.fetch()
                  this.dialogVisible = false
                } else {
                  this.$message.error(data.msg)
                }
              })
            }
          } else {
            return false
          }
        }
      })
    },
    dialogBeforeClose () {
      console.log(111)
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
 .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
  // #file {
  //   display: inline;
  // }
   .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
.a-upload {
  display: inline;
  padding: 4px 10px;
  //height: 20px;
  line-height: 20px;
  position: relative;
  cursor: pointer;
  color: white;;
  background: #409EFF;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  display: inline-block;
  *display: inline;
  *zoom: 1
}
.a-upload  input {
  position: absolute;
  font-size: 14px;
  right: 0;
  top: 0;
  opacity: 0;
  filter: alpha(opacity=0);
  cursor: pointer
}
// .a-upload:hover {
//   color: #444;
//   background: #eee;
//   border-color: #ccc;
//   text-decoration: none;
// }
</style>
