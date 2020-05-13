<template>
  <div>
    <i-search ref="isearch" :model="formData" @search="fetch" @reset="reset">
      <el-form-item label="下单人" prop="cusName">
        <el-input v-model="formData.cusName"></el-input>
      </el-form-item>
      <el-form-item label="订单编号" prop="orderCode">
        <el-input v-model="formData.orderCode"></el-input>
      </el-form-item>
      <el-form-item label="付款有效期起" label-width="100px" prop="payTimeStart">
        <div class="block">
          <el-date-picker
            value-format="yyyy/MM/dd"
            v-model="formData.payTimeStart"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="付款有效期止" label-width="100px" prop="payTimeOver">
        <div class="block">
          <!-- <span class="demonstration">默认</span> -->
          <el-date-picker
            value-format="yyyy/MM/dd"
            v-model="formData.payTimeOver"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formData.phone"></el-input>
      </el-form-item>
      <el-form-item label="订单状态" prop="orderStatus">
        <el-select v-model="formData.orderStatus" placeholder="请选择">
          <el-option label="全部" :value="''"></el-option>
          <el-option label="已下单" :value="0"></el-option>
          <el-option label="待取货" :value="1"></el-option>
          <el-option label="已取货" :value="2"></el-option>
          <el-option label="已取货未评价" :value="3"></el-option>
          <el-option label="已评价 " :value="4"></el-option>
          <el-option label="已取消 " :value="5"></el-option>
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
      <el-table border :data="detailstableData">
        <el-table-column
          v-for="(item, index) in detailscolumnList"
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
import req from '@/api/order-manage.js'
export default {
  name: 'order-manage',
  components: {
    ISearch,
    ITable,
    IDialog
  },
  data () {
    return {
      formData: {
        // cusName: '',
        // orderCode: '',
        // payTimeStart: '',
        // payTimeOver: '',
        // phone: '',
        // orderStatus: ,
      },
      dialogFormData: {},
      getCurrentObj: {}, // 获取勾选的当行的对象信息
      dialogVisible: false,
      operation: 0,
      dialogTitle: '新增用户',
      batchdeletion: '',
      pageInfo: {
        pageIndex: 1,
        pageSize: 5,
        total: 0
      },
      toolbar: [
        {
          btnName: '详情',
          type: 'primary',
          func: () => {
            if (this.getCurrentObj.length === undefined) {
              this.$message.error('请选择你要查看的订单')
            } else if (this.getCurrentObj.length === 1) {
              this.dialogTitle = '查看订单详情'
              this.dialogVisible = true
              this.orderCode = this.getCurrentObj[0].orderCode
              this.getOrder(this.orderCode)
              console.log(this.pageInfo)
            } else {
              this.$message.error('目前只能一次查看一个订单')
            }
          }
        },
        {
          btnName: '订单取消',
          type: 'primary',
          func: () => {
            if (this.getCurrentObj.length === undefined) {
              this.$message.error('请选择你要修改的订单')
            } else if (this.getCurrentObj.length >= 1) {
              this.batchdeletion = ''
              for (let i = 0; i < this.getCurrentObj.length; i++) {
                if (i < this.getCurrentObj.length - 1) {
                  console.log('i的值', i)
                  this.batchdeletion += this.getCurrentObj[i].orderCode
                  this.batchdeletion += ','
                } else {
                  console.log('i的值', i)
                  this.batchdeletion += this.getCurrentObj[this.getCurrentObj.length - 1].orderCode
                }
              }
              console.log('批量订单取消', this.batchdeletion)
              this.orderCode = this.batchdeletion
              this.operation = 5
              this.updateOrderState(this.orderCode, this.operation)
              console.log(this.pageInfo)
            }
          }
        },
        {
          btnName: '订单到货',
          type: 'primary',
          func: () => {
            if (this.getCurrentObj.length === undefined) {
              this.$message.error('请选择你要修改的订单')
            } else if (this.getCurrentObj.length >= 1) {
              this.batchdeletion = ''
              for (let i = 0; i < this.getCurrentObj.length; i++) {
                if (i < this.getCurrentObj.length - 1) {
                  console.log('i的值', i)
                  this.batchdeletion += this.getCurrentObj[i].orderCode
                  this.batchdeletion += ','
                } else {
                  console.log('i的值', i)
                  this.batchdeletion += this.getCurrentObj[this.getCurrentObj.length - 1].orderCode
                }
              }
              console.log('批量订单取消', this.batchdeletion)
              this.orderCode = this.batchdeletion
              this.operation = 1
              this.updateOrderState(this.orderCode, this.operation)
              console.log(this.pageInfo)
            }
          }
        },
        {
          btnName: '取消到货',
          type: 'primary',
          func: () => {
            if (this.getCurrentObj.length === undefined) {
              this.$message.error('请选择你要修改的订单')
            } else if (this.getCurrentObj.length >= 1) {
              this.batchdeletion = ''
              for (let i = 0; i < this.getCurrentObj.length; i++) {
                if (i < this.getCurrentObj.length - 1) {
                  this.batchdeletion += this.getCurrentObj[i].orderCode
                  this.batchdeletion += ','
                } else {
                  this.batchdeletion += this.getCurrentObj[this.getCurrentObj.length - 1].orderCode
                }
              }
              console.log('批量订单取消', this.batchdeletion)
              this.orderCode = this.batchdeletion
              this.operation = 0
              this.updateOrderState(this.orderCode, this.operation)
              console.log(this.pageInfo)
            }
          }
        },
        {
          btnName: '订单已取货',
          type: 'primary',
          func: () => {
            if (this.getCurrentObj.length === undefined) {
              this.$message.error('请选择你要修改的订单')
            } else if (this.getCurrentObj.length >= 1) {
              this.batchdeletion = ''
              for (let i = 0; i < this.getCurrentObj.length; i++) {
                if (i < this.getCurrentObj.length - 1) {
                  console.log('i的值', i)
                  this.batchdeletion += this.getCurrentObj[i].orderCode
                  this.batchdeletion += ','
                } else {
                  this.batchdeletion += this.getCurrentObj[this.getCurrentObj.length - 1].orderCode
                }
              }
              console.log('批量订单取消', this.batchdeletion)
              this.orderCode = this.batchdeletion
              this.operation = 2
              this.updateOrderState(this.orderCode, this.operation)
              console.log(this.pageInfo)
            }
          }
        },
        {
          btnName: '取消已取货',
          type: 'primary',
          func: () => {
            if (this.getCurrentObj.length === undefined) {
              this.$message.error('请选择你要修改的订单')
            } else if (this.getCurrentObj.length >= 1) {
              this.batchdeletion = ''
              for (let i = 0; i < this.getCurrentObj.length; i++) {
                if (i < this.getCurrentObj.length - 1) {
                  console.log('i的值', i)
                  this.batchdeletion += this.getCurrentObj[i].orderCode
                  this.batchdeletion += ','
                } else {
                  this.batchdeletion += this.getCurrentObj[this.getCurrentObj.length - 1].orderCode
                }
              }
              console.log('批量订单取消', this.batchdeletion)
              this.orderCode = this.batchdeletion
              this.operation = 1
              this.updateOrderState(this.orderCode, this.operation)
              console.log(this.pageInfo)
            }
          }
        }
      ],
      columnList: [
        {label: '订单编码', prop: 'orderCode'},
        {label: '订单总价', prop: 'sumPrice'},
        {label: '订单状态', prop: 'orderStatus'},
        {label: '门店编码', prop: 'storeCode'},
        {label: '下单人姓名', prop: 'cusName'},
        {label: '下单人手机号', prop: 'phone'},
        {label: '确认付款时间', prop: 'payTime'}
      ],
      detailscolumnList: [
        {label: '用户id', prop: 'orderCode'},
        {label: '订单编码', prop: 'orderCode'},
        {label: '商品编码', prop: 'goodsCode'},
        {label: '商品名称', prop: 'goodsName'},
        {label: '购买数量', prop: 'buyCount'},
        {label: '总金额', prop: 'sumPrice'},
        {label: '售价', prop: 'sellPrice'}
      ],
      tableData: [],
      detailstableData: [],
      formRules: {
        test1: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ],
        test2: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ],
        test3: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ],
        test4: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ],
        test5: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ],
        test6: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ],
        test7: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ],
        test8: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ]
      }
    }
  },
  mounted () {
    this.pageInfo.total = this.tableData.length
    this.fetch()
  },
  methods: {
    fetch () {
      this.pageInfo.pageSize = 5
      this.pageInfo.pageIndex = 1
      this.search()
    },
    search () {
      console.log('orderStatus', this.formData)
      req('listOrder', {
        ...this.formData,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageIndex
      }).then(data => {
        console.log('订单列表', data)
        console.log('list前')
        this.tableData = data.data.list
        console.log('list后')
        this.pageInfo.pageIndex = data.data.pageNum
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.total = data.data.total
        data.data.list.forEach(item => {
          if (item.orderStatus === '0') {
            item.orderStatus = '已下单'
          } else if (item.orderStatus === '1') {
            item.orderStatus = '待取货'
          } else if (item.orderStatus === '2') {
            item.orderStatus = '已取货'
          } else if (item.orderStatus === '3') {
            item.orderStatus = '已完成未评价'
          } else if (item.orderStatus === '4') {
            item.orderStatus = '已评价'
          } else {
            item.orderStatus = '取消'
          }
        })
      })
    },
    // 获取订单详情
    getOrder (value) {
      console.log('这里是订单编号', value)
      req('getOrderDetails', {
        orderCode: value
      }).then(data => {
        console.log('这里是订单详情数据', data)
        this.detailstableData = data.data
      })
    },
    // 修改订单状态
    updateOrderState (value1, value2) {
      console.log('这里是订单编号：', value1)
      console.log('这里是订单状态：', value2)
      req('updateOrderState', {
        orderCode: value1,
        operation: value2
      }).then(data => {
        if (data.code === 0) {
          this.$message.success(data.msg)
        } else {
          this.$message.error(data.msg)
        }
        this.search()
        console.log('这里是修改订单状态数据', data)
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
      this.getCurrentObj = rows
      console.log('rows', rows)
    },
    dialogCancel () {
      this.dialogVisible = false
    },
    dialogConfirm () {
      this.dialogVisible = false
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
