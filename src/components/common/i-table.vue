<template>
  <div class="i-table">
    <!-- <div class="btn-list" v-show="toolbar.length > 0 ? true : false"> -->
    <div class="btn-list" v-show="toolbar.length">
      <el-button v-for="(item, index) in toolbar"
      :type="item.type"
      :key="index"
      @click="item.func">
      {{item.btnName}}
      </el-button>
    </div>
    <div class="table-container">
      <el-table fixed style="width:90%" height="320px" border :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column
        fixed
        v-if="selectionShow"
        type="selection"
        align="center">
        </el-table-column>
        <slot></slot>
      </el-table>
    </div>

    <div class="table-pagination" v-show="tableData.length">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.pageIndex"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>

export default {
  name: 'i-table',
  data () {
    return {}
  },
  props: {
    toolbar: {
      type: Array,
      defalut: () => {
        return []
      }
    },
    tableData: {
      type: Array,
      defalut: () => {
        return []
      }
    },
    pageInfo: {
      type: Object,
      defalut: () => {
        return {
          pageIndex: 2,
          pageSize: 10,
          total: 0
        }
      }
    },
    selectionShow: {
      type: Boolean,
      defalut: true
    }
  },
  methods: {
    // 当前条数
    handleSizeChange (value) {
      this.$emit('handleSizeChange', value)
    },
    // 当前页数
    handleCurrentChange (value) {
      this.$emit('handleCurrentChange', value)
    },
    // 多选框改变
    handleSelectionChange (rows) {
      this.$emit('select-change', rows)
    }
  }
}
</script>

<style lang="scss" scoped>
.i-table {
  padding: 10px;
  .btn-list {
    margin-bottom: 10px;
  }
  .table-pagination{
    .el-pagination {
      margin-top: 10px;
      text-align: right;
    }
  }
}
</style>
