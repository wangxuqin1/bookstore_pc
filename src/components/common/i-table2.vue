<template>
  <div class="i-table">
    <!-- <div class="btn-list" v-show="toolbar.length > 0 ? true : false"> -->
    <!-- <div class="btn-list" v-show="toolbar.length">
      <el-button v-for="(item, index) in toolbar"
      :type="item.type"
      :key="index"
      @click="item.func">
      {{item.btnName}}
      </el-button>
    </div> -->
    <div class="table-container">
      <el-table border :data="tableData" @selection-change="handleSelectionChange2">
        <el-table-column
        v-if="selectionShow"
        type="selection"
        align="center">
        </el-table-column>

        <slot></slot>
      </el-table>
    </div>

    <div class="table-pagination" v-show="tableData.length">
      <el-pagination
        @size-change="handleSizeChange2"
        @current-change="handleCurrentChange2"
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
    return {
      currentPage1: 1
    }
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
          pageSize: 5,
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
    handleSizeChange2 (value) {
      this.$emit('handleSizeChange2', value)
    },
    // 当前页数
    handleCurrentChange2 (value) {
      this.$emit('handleCurrentChange2', value)
    },
    // 多选框改变
    handleSelectionChange2 (rows) {
      this.$emit('select-change2', rows)
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
