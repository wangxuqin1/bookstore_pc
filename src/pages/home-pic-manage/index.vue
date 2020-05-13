<template>
  <div>
    <i-search ref="isearch" :model="formData" @search="fetch" @reset="reset">
      <el-form-item label="状态" prop="status">
        <el-select v-model="formData.status" placeholder="请选择轮播图状态">
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="-1"></el-option>
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
       align="center"
       >
       <template slot-scope="scope">
         <el-button v-if="item.prop === 'image'" type="text" @click="watchImg(scope.row)">预览</el-button>
         <span v-else>{{ filterDist(scope.row[item.prop], item) }}</span>
       </template>
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
            <el-form-item label="排序" prop="sortOrdinal">
              <el-input v-model="dialogFormData.sortOrdinal"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- <el-form-item label="上传图片" ref="uploadElement" prop="image">
              <input id="file" type="file" @change="inputChange($event)"/>
            </el-form-item> -->
            <el-form-item label="上传图片" ref="uploadElement" prop="imageUrl">
              <div class="a-upload">
                <input id="file" type="file" @change="inputChange($event)"/>点击上传
              </div>
              <el-image
                v-show="isDisplay"
                style="width: 40px; height: 40px;border-radius:50%; display: inline-block; margin-left=20px"
                :src="dialogFormData.image"
                v-model="dialogFormData.image"
              >
              </el-image>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="有效期起" prop="valPeriodStart">
              <el-date-picker
                value-format="yyyy/MM/dd"
                v-model="dialogFormData.valPeriodStart"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效期止" prop="valPeriodOver">
              <el-date-picker
                value-format="yyyy/MM/dd"
                v-model="dialogFormData.valPeriodOver"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="select">
          <el-form-item label="商品" prop="goodsCode">
            <el-input v-model="helperData2.goodsName"></el-input>
            <el-button type="primary" @click="selectshop">选择</el-button>
            <el-input type="hidden" v-model="dialogFormData.goodsCode"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
    </i-dialog>
    <i-dialog2
      v-model="dialogVisible2"
      :title="dialogTitle2"
      @dialog-before-close2="dialogBeforeClose"
      @dialog-cancel2="dialogCancel2"
      @dialog-confirm2="dialogConfirm2">
      <i-search ref="isearch" :model="formData2" @search="search2" @reset="reset">
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="formData2.goodsName"></el-input>
        </el-form-item>
        <el-form-item label="商品编号" prop="goodsCode">
            <el-input v-model="formData2.goodsCode"></el-input>
        </el-form-item>
      </i-search>
      <i-table2
      :pageInfo="pageInfo2"
      :tableData="tableData2"
      :selectionShow="true"
      @handleSizeChange2="handleSizeChange2"
      @handleCurrentChange2="handleCurrentChange2"
      @select-change2="handleSelectionChange2">
        <el-table-column
        :show-overflow-tooltip="true"
        v-for="(item, index) in columnList2"
        :key="index"
        :label="item.label"
        :prop="item.prop"
        align="center">
        </el-table-column>
      </i-table2>
    </i-dialog2>
  </div>
</template>

<script>
import ISearch from '@/components/common/i-seaarch'
import ITable from '@/components/common/i-table'
import ITable2 from '@/components/common/i-table2'
import IDialog from '@/components/common/i-dialog'
import IDialog2 from '@/components/common/i-dialog2'
import req from '@/api/home-pic-manage.js'
import axios from 'axios'

export default {
  name: 'home-pic-manage',
  components: {
    ISearch,
    ITable,
    ITable2,
    IDialog,
    IDialog2
  },
  data () {
    return {
      formData: {},
      formData2: {},
      dialogFormData: {},
      helperData: {},
      helperData2: {goodsName: ''},
      dialogVisible: false,
      dialogVisible2: false,
      dialogTitle: '新增轮播图',
      dialogTitle2: '轮播商品选择',
      dialogType: 'addRotationChart',
      rotationChartCode: '',
      isDisplay: false,
      status: -1,
      selectNum: 0,
      batchdeletion: '',
      pageInfo: {
        pageIndex: 1,
        pageSize: 5,
        total: 0
      },
      pageInfo2: {
        pageIndex: 1,
        pageSize: 5,
        total: 0
      },
      // startTimePickerOptions: {
      //   disabledDate: (value) => {
      //     console.log('value111', value)
      //     return this.dialogFormData.valPeriodOver < value
      //   }
      // },
      // endTimePickerOptions: {
      //   disabledDate: (value) => {
      //     return this.dialogFormData.valPeriodStart > value
      //   }
      // },
      toolbar: [
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            this.isDisplay = false
            this.dialogType = 'addRotationChart'
            console.log(this.pageInfo)
            this.dialogVisible = true
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            if (this.helperData.length === undefined || this.helperData === null) {
              this.$message.error('请选择你要删除的用户')
            } else if (this.helperData.length >= 1) {
              this.$confirm('此操作将永久删除该文件,是否继续?').then(() => {
                this.batchdeletion = ''
                for (let i = 0; i < this.helperData.length; i++) {
                  if (i < this.helperData.length - 1) {
                    console.log('i的值', i)
                    this.batchdeletion += this.helperData[i].rotationChartCode
                    this.batchdeletion += ','
                  } else {
                    console.log('i的值', i)
                    this.batchdeletion += this.helperData[this.helperData.length - 1].rotationChartCode
                  }
                }
                console.log('批量删除', this.batchdeletion)
                console.log('批量删除')
                this.rotationChartCode = this.batchdeletion
                this.deleteRotationChart(this.rotationChartCode)
                console.log(this.pageInfo)
              })
            }
          }
        },
        {
          btnName: '启用',
          type: 'primary',
          func: () => {
            if (this.helperData.length === undefined) {
              this.$message.error('请选择你要启用的轮播图')
            } else if (this.helperData.length >= 1) {
              this.batchdeletion = ''
              for (let i = 0; i < this.helperData.length; i++) {
                if (i < this.helperData.length - 1) {
                  console.log('i的值', i)
                  this.batchdeletion += this.helperData[i].rotationChartCode
                  this.batchdeletion += ','
                } else {
                  console.log('i的值', i)
                  this.batchdeletion += this.helperData[this.helperData.length - 1].rotationChartCode
                }
              }
              console.log('批量启用', this.batchdeletion)
              console.log('批量启用')
              this.rotationChartCode = this.batchdeletion
              this.status = 1
              this.upRotationChartState(this.rotationChartCode, this.status)
              console.log(this.pageInfo)
            }
          }
        },
        {
          btnName: '禁用',
          type: 'primary',
          func: () => {
            if (this.helperData.length === undefined) {
              this.$message.error('请选择你要禁用的轮播图')
            } else if (this.helperData.length >= 1) {
              this.batchdeletion = ''
              for (let i = 0; i < this.helperData.length; i++) {
                if (i < this.helperData.length - 1) {
                  console.log('i的值', i)
                  this.batchdeletion += this.helperData[i].rotationChartCode
                  this.batchdeletion += ','
                } else {
                  console.log('i的值', i)
                  this.batchdeletion += this.helperData[this.helperData.length - 1].rotationChartCode
                }
              }
              console.log('批量启用', this.batchdeletion)
              console.log('批量启用')
              this.rotationChartCode = this.batchdeletion
              this.status = -1
              this.downRotationChartState(this.rotationChartCode, this.status)
              console.log(this.pageInfo)
            }
          }
        }
      ],
      toolbar2: [],
      columnList: [
        {label: '排序', prop: 'sortOrdinal'},
        {label: '商品名称', prop: 'goodsName'},
        {label: '图片路径', prop: 'imageUrl'},
        {label: '状态', prop: 'status'},
        {label: '预览', prop: 'image'},
        {label: '有效期起', prop: 'valPeriodStart'},
        {label: '有效期止', prop: 'valPeriodOver'}
      ],
      columnList2: [
        {label: '商品编号', prop: 'goodsCode'},
        {label: '商品名称', prop: 'goodsName'},
        {label: '商品状态', prop: 'goodsStatus'},
        {label: '一级分类', prop: 'classOneName'},
        {label: '二级分类', prop: 'classSecondName'}
      ],
      tableData: [],
      tableData2: [],
      formRules: {
        sortOrdinal: [
          {required: true, message: '请输入商品排序号', trigger: 'change'}
        ],
        valPeriodStart: [
          {required: true, message: '请选择开始时间', trigger: 'change'}
        ],
        valPeriodOver: [
          {required: true, message: '请选择停止时间', trigger: 'change'}
        ],
        goodsCode: [
          {required: true, message: '请选择商品', trigger: 'change'}
        ]
      }
    }
  },
  created () {
    this.fetch()
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
      req('listRotationChart', {
        ...this.formData,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageIndex
      }).then(data => {
        this.tableData = data.data.list
        this.pageInfo.pageIndex = data.data.pageNum
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.total = data.data.total
        // this.$message.success(data.msg)
        console.log(data)
        data.data.list.forEach(item => {
          if (item.status === 1) {
            item.status = '启用'
          } else {
            item.status = '禁用'
          }
        })
      })
    },
    search2 () {
      req('listGoods', {
        ...this.formData2,
        pageSize: this.pageInfo2.pageSize,
        pageNum: this.pageInfo2.pageIndex
      }).then(data => {
        this.tableData2 = data.data.list
        this.pageInfo2.pageIndex = data.data.pageNum
        this.pageInfo2.pageSize = data.data.pageSize
        this.pageInfo2.total = data.data.total
        console.log('嵌套列表：', data)
        data.data.list.forEach(item => {
          if (item.goodsStatus === 1) {
            item.goodsStatus = '未发布'
          } else if (item.goodsStatus === 2) {
            item.goodsStatus = '已上架'
          } else {
            item.goodsStatus = '下架'
          }
        })
      })
    },
    deleteRotationChart (value) {
      req('deleteRotationChart', {
        rotationChartCode: value
      }).then(data => {
        this.search()
        this.$message.success(data.msg)
      })
    },
    upRotationChartState (value1, value2) {
      console.log('rotationChartCode', value1)
      console.log('status', value2)
      req('updateRotationChartState', {
        rotationChartCode: value1,
        status: value2
      }).then(data => {
        console.log('轮播图已修改为启用状态', data)
        this.fetch()
        this.$message.success(data.msg)
      })
    },
    downRotationChartState (value1, value2) {
      req('updateRotationChartState', {
        rotationChartCode: value1,
        status: value2
      }).then(data => {
        console.log('轮播图已修改为禁用状态', data)
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
        this.imageUrls = data.data.data
        if (this.imageUrls) {
          this.dialogFormData.image = this.imageUrls
          console.log('图片路径', this.dialogFormData.image)
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
    },
    handleCurrentChange (value) {
      this.pageInfo.pageIndex = value
      // this.getTableData()
      this.search()
      console.log('当前第几页', value)
    },
    handleSelectionChange (rows) {
      this.helperData = rows
      console.log('rows', rows)
    },
    handleSizeChange2 (value) {
      this.pageInfo2.pageSize = value
      this.search2()
    },
    handleCurrentChange2 (value) {
      this.pageInfo2.pageIndex = value
      // this.getTableData()
      this.search2()
      console.log('当前第几页', value)
    },
    handleSelectionChange2 (rows) {
      console.log('handleSelectionChange2rows', rows)
      this.helperData2 = rows
      if (rows.length === 1) {
        this.helperData2.goodsName = rows[0].goodsName
        this.dialogFormData.goodsCode = rows[0].goodsCode
        this.selectNum = rows.length
      }
    },
    dialogCancel () {
      this.dialogVisible = false
      this.$refs.form.resetFields()
    },
    dialogCancel2 () {
      this.dialogVisible2 = false
    },
    dialogConfirm2 () {
      if (this.selectNum === 0) {
        this.$message.error('请选择轮播商品')
      } else if (this.selectNum === 1) {
        this.dialogVisible2 = false
      } else {
        this.$message.error('目前只能选择一个轮播商品')
      }
    },
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogType === 'addRotationChart') {
            // this.dialogFormData.image = this.imageUrls
            console.log('this.dialogFormData', this.dialogFormData)
            req('addRotationChart', {
              ...this.dialogFormData
            }).then(data => {
              console.log(data)
              if (data.code === 0) {
                this.helperData.goodsName = null
                this.$message.success(data.msg)
                this.fetch()
                this.$refs.form.resetFields()
                this.dialogVisible = false
              } else {
                this.$message.error(data.msg)
              }
            })
          } else {
            req('updateGoods', {
              ...this.dialogFormData
            }).then(data => {
              console.log(data)
              if (data.code === 0) {
                this.$message.success(data.msg)
                this.fetch()
                this.dialogVisible = false
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
    },
    selectshop () {
      this.dialogVisible2 = true
      this.search2()
    },
    // 查看图片
    watchImg (data) {
      console.log('看图data123', data)
      window.open(data.image)
    },
    filterDist (value, item) {
      // console.log('item212', item)
      // console.log('value2123', value)
      if (item.distName) {
        return this[item.distName].filter(distItem => {
          return distItem.value === value
        })[0].label
      } else {
        return value
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.select {
  .el-input {
    width: 230px;
    height: 30px;
    margin-right: 20px;
  }
}
.a-upload {
  padding: 4px 10px;
  height: 20px;
  line-height: 20px;
  position: relative;
  cursor: pointer;
  //color: #888;
  // background: #fafafa;
  color: white;
  background: #409EFF;
  //@at-rootborder: 1px solid #ddd;
  //border-radius: 4px;
  overflow: hidden;
  display: inline-block;
  *display: inline;
  outline: none;
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
.el-form .el-form-item .el-form-item__content .el-input .el-input__inner {
    border-radius: 0;
    height: 30px;
    width: 220px;
}
</style>
