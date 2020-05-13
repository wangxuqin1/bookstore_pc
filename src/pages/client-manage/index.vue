<template>
  <div>
    <i-search ref="isearch" :model="formData" @search="fetch" @reset="reset">
      <el-form-item label="客户名称" prop="cusName">
        <el-input v-model="formData.cusName"></el-input>
      </el-form-item>
      <el-form-item label="客户账号" prop="cusAccount">
        <el-input v-model="formData.cusAccount"></el-input>
      </el-form-item>
    </i-search>
    <!-- <el-button @click="test">click</el-button> -->
    <i-table
    :toolbar="toolbar"
    :pageInfo="pageInfo"
    :tableData="tableData"
    :selectionShow="false"
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
  </div>
</template>
<script>
import ISearch from '@/components/common/i-seaarch'
import ITable from '@/components/common/i-table'
import IDialog from '@/components/common/i-dialog'
import req from '@/api/client-manage.js'
export default {
  name: 'client-manage',
  components: {
    ISearch,
    ITable,
    IDialog
  },
  data () {
    return {
      formData: {},
      pageInfo: {
        pageIndex: 1,
        pageSize: 5,
        total: 0
      },
      toolbar: [],
      columnList: [
        {label: '客户账号', prop: 'cusAccount'},
        {label: '姓名', prop: 'cusName'},
        {label: '性别', prop: 'sex'},
        {label: '手机', prop: 'phone'},
        {label: '客户邮箱', prop: 'email'},
        {label: '身份证', prop: 'idCard'}
      ],
      tableData: []
    }
  },
  mounted () {
    this.pageInfo.total = this.tableData.length
  },
  created () {
    this.fetch()
  },
  methods: {
    fetch () {
      this.pageInfo.pageSize = 5
      this.pageInfo.pageIndex = 1
      this.search()
    },
    search () {
      req('listCustomer', {
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
          if (item.sex === '0') {
            item.sex = '男'
          } else {
            item.sex = '女'
          }
        })
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
      console.log('rows', rows)
    },
    dialogCancel () {
      this.dialogVisible = false
    }
    // dialogConfirm () {
    //   this.$refs.form.validate((valid) => {
    //     if (valid) {
    //       console.log('表单校验通过了')
    //       console.log(this.dialogFormData)
    //     } else {
    //       return false
    //     }
    //   })
    // },
    // dialogBeforeClose () {
    //   console.log(111)
    //   this.$refs.form.resetFields()
    // }
  }
}
</script>

<style lang="scss" scoped>

</style>
