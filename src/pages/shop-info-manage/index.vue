<template>
  <div>
    <i-search ref="isearch" :model="formData" @search="fetch" @reset="reset">
      <el-form-item label="门店编号" prop="storeCode">
        <el-input v-model="formData.storeCode"></el-input>
      </el-form-item>
      <el-form-item label="门店名称" prop="storeName">
        <el-input v-model="formData.storeName"></el-input>
      </el-form-item>
      <el-form-item label="店长名称" prop="userName">
        <el-input v-model="formData.userName"></el-input>
      </el-form-item>
      <el-form-item label="所在省份" prop="provinceCode">
        <el-select @focus="listProvince" @change="listProvinceCode(formData.provinceName, 1)" v-model="formData.provinceName" placeholder="请选择">
          <el-option v-for="(item, index) in this.provinces" :key="index" :label="item.provinceName" :value="`${item.provinceName}|${item.provinceCode}`"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所在城市" prop="cityCode">
        <el-select  @change="listCityCode(formData.cityName, 1)" v-model="formData.cityName" placeholder="请选择">
          <el-option v-for="(item, index) in this.citys" :key="index" :label="item.cityName" :value="`${item.cityName}|${item.cityCode}`"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所在区" prop="areaCode">
        <el-select v-model="formData.areaName" @change="listAreaCode(formData.areaName, 1)" placeholder="请选择">
          <el-option v-for="(item, index) in this.areas" :key="index" :label="item.areaName" :value="`${item.areaName}|${item.areaCode}`"></el-option>
        </el-select>
      </el-form-item>
    </i-search>
    <!-- <el-button @click="test">click</el-button> -->
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
            <el-form-item label="门店名称" prop="storeName">
              <el-input v-model="dialogFormData.storeName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="dialogFormData.phone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="店长编号" prop="userCode">
              <el-input v-model="dialogFormData.userCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="营业执照编号" label-width="110px" prop="busLisCode">
              <el-input v-model="dialogFormData.busLisCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所在省份" prop="provinceName">
              <el-select @focus="listProvince" @change="listProvinceCode(dialogFormData.provinceName, 2)" v-model="dialogFormData.provinceName" placeholder="请选择">
                <el-option v-for="(item, index) in this.provinces" :key="index" :label="item.provinceName" :value="`${item.provinceName}|${item.provinceCode}`"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在城市" prop="cityName">
              <el-select  @change="listCityCode(dialogFormData.cityName, 2)" v-model="dialogFormData.cityName" placeholder="请选择">
                <el-option v-for="(item, index) in this.citys" :key="index" :label="item.cityName" :value="`${item.cityName}|${item.cityCode}`"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所在区" prop="areaName">
              <el-select v-model="dialogFormData.areaName" @change="listAreaCode(dialogFormData.areaName, 2)" placeholder="请选择">
                <el-option v-for="(item, index) in this.areas" :key="index" :label="item.areaName" :value="`${item.areaName}|${item.areaCode}`"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="详细地址" prop="detailedAddress">
              <el-input  type="textarea" v-model="dialogFormData.detailedAddress"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </i-dialog>
    <i-dialog
      v-model="dialogVisible2"
      :title="dialogTitle2"
      @dialog-before-close="dialogBeforeClose"
      @dialog-cancel="dialogCancel2"
      @dialog-confirm="detaildialogConfirm">
      <el-table border :data="detailtableData">
        <el-table-column
          v-for="(item, index) in detailsColumnList"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          align="center">
        </el-table-column>
      </el-table>
    </i-dialog>
  </div>
</template>

<script>
import ISearch from '@/components/common/i-seaarch'
import ITable from '@/components/common/i-table'
import IDialog from '@/components/common/i-dialog'
import req from '@/api/shop-info-manage.js'
export default {
  name: 'shop-info-manage',
  components: {
    ISearch,
    ITable,
    IDialog
  },
  data () {
    return {
      formData: {}, // 搜索查询的对象
      dialogFormData: {}, // 弹出框的对象
      provinces: {}, // 省份对象
      citys: {}, // 城市对象
      areas: {}, // 区对象
      getCurrentObj: {}, // 获取勾选的信息对象
      detailstableData: [], // 详情列表
      dialogVisible: false, // 控制弹出框显示隐藏
      dialogVisible2: false, // 控制弹出框显示隐藏
      dialogTitle: '新增门店',
      dialogTitle2: '查看详情',
      dialogType: 'addStore',
      storeCode: '',
      batchdeletion: '',
      role: 0,
      pageInfo: {
        pageIndex: 1,
        pageSize: 5,
        total: 0
      },
      toolbar: [],
      columnList: [
        {label: '门店编号', prop: 'storeCode'},
        {label: '门店名称', prop: 'storeName'},
        {label: '电话', prop: 'phone'},
        {label: '详细地址', prop: 'detailedAddress'},
        {label: '店长姓名', prop: 'userName'},
        {label: '邀请码', prop: 'invCode'},
        {label: '店长账号', prop: 'userAccount'}
      ],
      detailsColumnList: [
        {label: '门店编号', prop: 'storeCode'},
        {label: '门店名称', prop: 'storeName'},
        {label: '店长编号', prop: 'userCode'},
        {label: '门店所在省份', prop: 'provinceName'},
        {label: '门店所在城市', prop: 'cityName'},
        {label: '门店所在区', prop: 'areaName'}
      ],
      tableData: [],
      detailtableData: [],
      formRules: {
        storeName: [
          {required: true, message: '请输入门店名称', trigger: 'change'}
        ],
        phone: [
          {required: true, message: '请输入联系电话', trigger: 'change'}
        ],
        userCode: [
          {required: true, message: '请输入店长编号', trigger: 'change'}
        ],
        busLisCode: [
          {required: true, message: '请输入营业执照编号', trigger: 'change'}
        ],
        provinceName: [
          {required: true, message: '请选择所在省份', trigger: 'change'}
        ],
        cityName: [
          {required: true, message: '请选择所在城市', trigger: 'change'}
        ],
        detailedAddress: [
          {required: true, message: '请输入详细地址', trigger: 'change'}
        ],
        areaName: [
          {required: true, message: '请选择所在区', trigger: 'change'}
        ]
      }
    }
  },
  created () {
    this.fetch()
    this.getRole()
  },
  mounted () {
    this.pageInfo.total = this.tableData.length
  },
  methods: {
    fetch () {
      this.pageInfo.pageSize = 5
      this.pageInfo.pageIndex = 1
      this.search()
    },
    search () {
      req('listStore', {
        ...this.formData,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageIndex
      }).then(data => {
        this.tableData = data.data.list
        this.pageInfo.pageIndex = data.data.pageNum
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.total = data.data.total
        console.log(data)
      })
    },
    getRole () {
      req('userMessage', {
      }).then(data => {
        this.role = data.data.role
        if (this.role === 1) {
          this.toolbar = [
            {
              btnName: '详情',
              type: 'primary',
              func: () => {
                if (this.getCurrentObj.length === undefined) {
                  this.$message.error('请选择你要查看的门店')
                } else if (this.getCurrentObj.length === 1) {
                  this.dialogVisible2 = true
                  this.storeCode = this.getCurrentObj[0].storeCode
                  this.getStore(this.storeCode)
                  console.log(this.pageInfo)
                } else {
                  this.$message.error('目前只能一次查看一个门店')
                }
              }
            },
            {
              btnName: '新增',
              type: 'primary',
              func: () => {
                this.dialogType = 'addStore'
                this.dialogTitle = '新增门店'
                console.log('hhhhhhhhhhh', this.pageInfo)
                this.dialogVisible = true
              }
            },
            {
              btnName: '修改',
              type: 'primary',
              func: () => {
                if (this.getCurrentObj.length === undefined) {
                  this.$message.error('请选择你要修改的门店')
                } else if (this.getCurrentObj.length === 1) {
                  this.dialogVisible = true
                  this.dialogTitle = '修改门店'
                  this.dialogType = 'updateStore'
                  this.storeCode = this.getCurrentObj[0].storeCode
                  this.getStore(this.storeCode)
                  console.log(this.pageInfo)
                } else {
                  this.$message.error('目前只能一次修改一个门店')
                }
              }
            },
            {
              btnName: '删除',
              type: 'primary',
              func: () => {
                this.$confirm('此操作将永久删除该文件,是否继续?').then(() => {
                  if (this.getCurrentObj.length === undefined) {
                    this.$message.error('请选择你要修改的门店')
                  } else if (this.getCurrentObj.length >= 1) {
                    this.dialogType = 'delete'
                    for (let i = 0; i < this.getCurrentObj.length; i++) {
                      if (i < this.getCurrentObj.length - 1) {
                        console.log('i的值', i)
                        this.batchdeletion += this.getCurrentObj[i].storeCode
                        this.batchdeletion += ','
                      } else {
                        console.log('i的值', i)
                        this.batchdeletion += this.getCurrentObj[this.getCurrentObj.length - 1].storeCode
                      }
                    }
                    console.log('批量', this.batchdeletion)
                    this.storeCode = this.batchdeletion
                    this.deleteStore(this.storeCode)
                    console.log(this.pageInfo)
                  }
                })
              }
            }
          ]
        } else {
          this.toolbar = [
            {
              btnName: '详情',
              type: 'primary',
              func: () => {
                if (this.getCurrentObj.length === undefined) {
                  this.$message.error('请选择你要查看的门店')
                } else if (this.getCurrentObj.length === 1) {
                  this.dialogVisible2 = true
                  this.storeCode = this.getCurrentObj[0].storeCode
                  this.getStore(this.storeCode)
                  console.log(this.pageInfo)
                } else {
                  this.$message.error('目前只能一次查看一个门店')
                }
              }
            },
            {
              btnName: '修改',
              type: 'primary',
              func: () => {
                if (this.getCurrentObj.length === undefined) {
                  this.$message.error('请选择你要修改的门店')
                } else if (this.getCurrentObj.length >= 1) {
                  this.dialogVisible = true
                  this.dialogTitle = '修改门店'
                  this.dialogType = 'updateStore'
                  for (let i = 0; i < this.getCurrentObj.length; i++) {
                    if (i < this.getCurrentObj.length - 1) {
                      console.log('i的值', i)
                      this.batchdeletion += this.getCurrentObj[i].storeCode
                      this.batchdeletion += ','
                    } else {
                      console.log('i的值', i)
                      this.batchdeletion += this.getCurrentObj[this.getCurrentObj.length - 1].storeCode
                    }
                  }
                  console.log('批量', this.batchdeletion)
                  this.storeCode = this.batchdeletion
                  this.getStore(this.storeCode)
                }
              }
            }
          ]
        }
        console.log('获取角色信息', data)
      })
    },
    getStore (value) {
      console.log('这里门店编码', value)
      req('getStore', {
        storeCode: value
      }).then(data => {
        this.detailtableData = []
        this.detailtableData.push(data.data)
        this.dialogFormData = Object.assign({}, data.data)
        console.log('这里是门店详情数据', data)
      })
    },
    deleteStore (value) {
      req('deleteStore', {
        storeCode: value
      }).then(data => {
        this.search()
        this.$message.success(data.msg)
      })
    },
    // 省份数据
    listProvince () {
      console.log('触发了省份查询')
      req('listProvince', {
      }).then(data => {
        this.provinces = data.data
        console.log('省份数据：', data)
        // this.formData.cityName = ''
        // this.formData.areaName = ''
      })
    },
    // 城市数据
    listProvinceCode (value, value2) {
      value = value.split('|')
      if (value2 === 1) {
        this.formData.provinceName = value[0]
        this.formData.provinceCode = value[1]
      } else {
        this.dialogFormData.provinceName = value[0]
        this.dialogFormData.provinceCode = value[1]
      }
      console.log('省份编码', value)
      req('listCity', {
        provinceCode: value[1]
      }).then(data => {
        this.citys = data.data
        console.log('城市数据：', data)
        console.log('省份数据：', this.province)
        // this.formData.areaName = ''
        // console.log('province[i].provinceCode', this.province[0].provinceName)
        // for (let i = 0; i < this.province.length; i++) {
        //   // console.log('province[i].provinceCode', province[i].provinceCode)
        //   if (this.province[i].provinceCode === value) {
        //     this.dialogFormData.province = this.province[i].provinceName
        //     console.log('this.dialogFormData.province', this.dialogFormData.province)
        //   }
        // }
      })
    },

    // 区数据
    listCityCode (value, value2) {
      value = value.split('|')
      if (value2 === 1) {
        this.formData.cityName = value[0]
        this.formData.cityCode = value[1]
      } else {
        this.dialogFormData.cityName = value[0]
        this.dialogFormData.cityCode = value[1]
      }
      console.log('城市编码', value)
      req('listArea', {
        cityCode: value[1]
      }).then(data => {
        this.areas = data.data
        console.log('区域数据：', data)
      })
      // for (let i = 0; i < this.city.length; i++) {
      //   if (this.city[i].cityCode === value) {
      //     this.dialogFormData.city = this.city[i].cityName
      //     console.log('this.dialogFormData.city', this.dialogFormData.city)
      //   }
      // }
    },
    listAreaCode (value, value2) {
      // for (let i = 0; i < this.area.length; i++) {
      //   if (this.area[i].areaCode === value) {
      //     this.dialogFormData.area = this.area[i].areaName
      //     console.log('this.dialogFormData.area', this.dialogFormData.area)
      //   }
      // }
      value = value.split('|')
      if (value2 === 1) {
        this.formData.areaName = value[0]
        this.formData.areaCode = value[1]
      } else {
        this.dialogFormData.areaName = value[0]
        this.dialogFormData.areaCode = value[1]
      }
      console.log('区域编码', value)
    },
    reset () {
      console.log('重置按钮被点击了')
    },
    handleSizeChange (value) {
      this.pageInfo.pageSize = value
      this.search()
    },
    handleCurrentChange (value) {
      this.pageInfo.pageIndex = value
      this.search()
      console.log('当前第几页', value)
    },
    handleSelectionChange (rows) {
      this.getCurrentObj = rows
      console.log('rows', rows)
    },
    dialogCancel () {
      this.dialogVisible = false
      this.$refs.form.resetFields()
    },
    dialogCancel2 () {
      this.dialogVisible2 = false
    },
    detaildialogConfirm () {
      this.dialogVisible2 = false
    },
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogType === 'addStore') {
            console.log('this.dialogFormData', this.dialogFormData)
            req('addStore', {
              ...this.dialogFormData
            }).then(data => {
              console.log(data)
              if (data.code === 0) {
                this.$message.success(data.msg)
                // this.fetch()
                this.search()
                this.dialogVisible = false
                this.$refs.form.resetFields()
              } else {
                this.$message.error(data.msg)
              }
            })
          } else {
            console.log('进入修改店门页面')
            console.log('this.dialogFormData', this.dialogFormData)
            req('updateStore', {
              ...this.dialogFormData
            }).then(data => {
              console.log(data)
              if (data.code === 0) {
                this.$message.success(data.msg)
                this.dialogVisible = false
                this.search()
                this.$refs.form.resetFields()
              } else {
                this.$message.erroe(data.msg)
              }
            })
          }
        } else {
          return false
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

</style>
