<template>
  <div>
    <i-search ref="isearch" :model="formData" @search="fetch" @reset="reset">
      <el-form-item label="商品名称" prop="goodsName">
        <el-input v-model="formData.goodsName"></el-input>
      </el-form-item>
       <el-form-item label="商品编号" prop="goodsCode">
          <el-input v-model="formData.goodsCode"></el-input>
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
    <!-- 设置dialog内容 -->
    <i-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      @dialog-before-close="dialogBeforeClose"
      @dialog-cancel="dialogCancel"
      @dialog-confirm="dialogConfirm">
      <el-form :model="dialogFormData" ref="form" :rules="formRules" label-width="100px">
        <el-row class="select-button">
          <!-- <el-col :span="12"> -->
          <el-form-item label="商品" prop="goodsCode">
            <el-input v-model="helperData2.goodsName"></el-input>
            <el-button type="primary" @click="selectshop">选择</el-button>
            <el-input type="hidden" v-model="dialogFormData.goodsCode"></el-input>
          </el-form-item>
          <!-- </el-col> -->
        </el-row>
        <el-row>
          <el-form-item label="热门位排序" prop="sortOrdinal">
            <el-input v-model="dialogFormData.sortOrdinal"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
    </i-dialog>
    <!-- 设置查询嵌套dialog信息 -->
    <i-dialog2
      v-model="dialogVisible2"
      :title="dialogTitle2"
      @dialog-before-close2="dialogBeforeClose2"
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
    <!-- 设置展示数量 -->
    <i-dialog
      v-model="dialogVisible3"
      :title="dialogTitle3"
      @dialog-before-close="dialogBeforeClose3"
      @dialog-cancel="dialogCancel3"
      @dialog-confirm="dialogConfirm3">
      <el-form :model="dialogFormData" ref="form3" :rules="formRules" label-width="120px">
        <el-row class="select-button">
          <el-form-item label="商品展示数量" prop="goodsCode">
            <el-input v-model="displayCount"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
    </i-dialog>
  </div>
</template>

<script>
import ISearch from '@/components/common/i-seaarch'
import ITable from '@/components/common/i-table'
import ITable2 from '@/components/common/i-table2'
import IDialog from '@/components/common/i-dialog'
import IDialog2 from '@/components/common/i-dialog2'
import req from '@/api/hot-comm-manage.js'
export default {
  name: 'hot-comm-manage',
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
      helperData: {},
      helperData2: {},
      dialogFormData: {},
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogTitle: '新增商品',
      dialogTitle2: '热门位商品选择',
      dialogTitle3: '设置数量展示',
      dialogType: 'addHotGoods',
      batchdeletion: '',
      displayCount: '',
      hotGoodsCode: 0,
      version: 0,
      pageInfo: {
        pageIndex: 1,
        pageSize: 5,
        total: 0
      },
      toolbar2: [],
      pageInfo2: {
        pageIndex: 1,
        pageSize: 5,
        total: 0
      },
      toolbar: [
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            this.dialogType = 'addHotGoods'
            console.log(this.pageInfo)
            this.dialogVisible = true
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            if (this.helperData.length === undefined) {
              this.$message.error('请选择你要修改的热门商品')
            } else if (this.helperData.length === 1) {
              // this.dialogType = 'update'
              this.dialogTitle = '修改热门商品'
              this.dialogVisible = true
              this.dialogType = 'updateHotGoods'
              this.hotGoodsCode = this.helperData[0].hotGoodsCode
              this.version = this.helperData[0].version
              // this.goodsCode = this.helperData2[0].goodsCode
              this.getHotGoods(this.hotGoodsCode)
              console.log(this.pageInfo)
            } else {
              this.$message.error('目前只能一次修改一个热门商品')
            }
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            if (this.helperData.length === undefined || this.helperData === null) {
              this.$message.error('请选择你要删除的热门商品')
            } else if (this.helperData.length >= 1) {
              this.$confirm('此操作将永久删除该文件,是否继续?').then(() => {
                for (let i = 0; i < this.helperData.length; i++) {
                  if (i < this.helperData.length - 1) {
                    console.log('i的值', i)
                    this.batchdeletion += this.helperData[i].hotGoodsCode
                    this.batchdeletion += ','
                  } else {
                    console.log('i的值', i)
                    this.batchdeletion += this.helperData[this.helperData.length - 1].hotGoodsCode
                  }
                }
                console.log('批量', this.batchdeletion)
                this.hotGoodsCode = this.batchdeletion
                this.deleteHotGoods(this.hotGoodsCode)
                console.log(this.pageInfo)
              })
            }
          }
        },
        {
          btnName: '展示数量设置',
          type: 'primary',
          func: () => {
            this.dialogVisible3 = true
          }
        }
      ],
      columnList: [
        {label: '排序', prop: 'sortOrdinal'},
        {label: '商品编号', prop: 'goodsCode'},
        {label: '商品名称', prop: 'goodsName'},
        {label: '商品价格', prop: 'sellPrice'},
        {label: '商品介绍', prop: 'goodsIntro'}
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
        // goodsCode: [
        //   {required: true, message: '请输入活动名称', trigger: 'change'}
        // ],
        // sortOrdinal: [
        //   {required: true, message: '请输入活动名称', trigger: 'change'}
        // ]
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
    // 查询热门商品列表
    search () {
      req('listHotGoods', {
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
    // 查询嵌套的dialog的商品信息
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
        this.tableData2.forEach(item => {
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
    // 查询热门商品信息
    getHotGoods (value) {
      req('getHotGoods', {
        hotGoodsCode: value
      }).then(data => {
        console.log('这里是热门查询数据s', data)
        this.helperData2 = Object.assign({}, data.data) // 回显修改热门商品的名
        this.dialogFormData = Object.assign({}, data.data)// 回显修改热门商品的位序
        console.log(' 查询this.dialogFormData ', this.dialogFormData)
      })
    },
    // 删除热门商品
    deleteHotGoods (value) {
      req('deleteHotGoods', {
        hotGoodsCode: value
      }).then(data => {
        this.fetch()
        this.$message.success(data.msg)
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
      console.log('每页多少条', value)
    },
    handleCurrentChange2 (value) {
      this.pageInfo2.pageIndex = value
      this.search2()
      console.log('当前第几页', value)
    },
    handleSelectionChange2 (rows) {
      console.log('handleSelectionChange2rows', rows)
      if (rows.length === 1) {
        // this.helperData2 === rows
        this.helperData2.goodsName = rows[0].goodsName
        this.dialogFormData.goodsCode = rows[0].goodsCode
        console.log('勾选', this.dialogFormData.goodsCode)
        this.selectNum = rows.length
      }
    },
    // 二级dialog列表取消按钮
    dialogCancel2 () {
      this.dialogVisible2 = false
      // this.$refs.form2.resetFields()
    },
    // 二级dialog列表确定按钮
    dialogConfirm2 () {
      if (this.selectNum === 0) {
        this.$message.error('请选择轮播商品')
      } else if (this.selectNum === 1) {
        this.dialogVisible2 = false
      } else {
        this.$message.error('目前只能选择一个轮播商品')
      }
    },
    // 设置展示数量的确认按钮
    dialogConfirm3 () {
      this.$refs.form3.validate((valid) => {
        if (valid) {
          console.log('this.displayCount', this.displayCount)
          req('setDisplayCount', {
            displayCount: this.displayCount
          }).then(data => {
            if (data.code === 0) {
              this.$message.success(data.msg)
              // this.fetch()
              this.dialogVisible3 = false
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    // 设置展示数量的取消按钮
    dialogCancel3 () {
      this.dialogVisible3 = false
      this.$refs.form3.resetFields()
    },
    dialogCancel () {
      this.dialogVisible = false
      this.$refs.form.resetFields()
    },
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogType === 'addHotGoods') {
            console.log('this.dialogFormData', this.dialogFormData)
            req('addHotGoods', {
              ...this.dialogFormData
            }).then(data => {
              console.log(data)
              if (data.code === 0) {
                this.$message.success(data.msg)
                this.fetch()
                this.dialogVisible = false
                this.helperData2.goodsName = null
                this.$refs.form.resetFields()
              } else {
                this.$message.error(data.msg)
              }
            })
          } else {
            // console.log('this.dialogFormData', this.dialogFormData)
            // console.log('进入修改状态')
            // console.log('this.hotGoodsCode', typeof this.hotGoodsCode)
            // console.log(' this.dialogFormData.goodsCode', typeof this.dialogFormData.goodsCode)
            // console.log('this.hotGoodsCode', this.hotGoodsCode)
            // console.log(' this.dialogFormData.goodsCode', this.dialogFormData.goodsCode)
            // console.log('this.sortOrdinal', this.dialogFormData.sortOrdinal)
            // console.log('this.version', this.version)
            req('updateHotGoods', {
              hotGoodsCode: this.hotGoodsCode,
              goodsCode: this.dialogFormData.goodsCode,
              sortOrdinal: this.dialogFormData.sortOrdinal,
              version: this.version
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
      })
    },
    dialogBeforeClose () {
      console.log(111)
      this.$refs.form.resetFields()
    },
    dialogBeforeClose2 () {
      console.log(111)
      this.$refs.form2.resetFields()
    },
    dialogBeforeClose3 () {
      console.log(111)
      this.$refs.form3.resetFields()
    },
    selectshop () {
      this.dialogVisible2 = true
      this.search2()
    }
  }
}
</script>

<style lang="scss" scoped>
.select-button {
  .el-input {
    width: 265px;
    height: 30px;
    margin-right: 20px;
  }
}
.el-input {
  border-radius: 0;
  height: 30px;
  width: 265px;
}
</style>
