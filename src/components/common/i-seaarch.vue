<template>
  <div class="i-search">
    <el-form ref="form" :inline="true" :model="model">
      <slot></slot>
      <el-form-item>
        <el-button @click="search" type="primary">搜索</el-button>
        <el-button @click="reset" type="primary">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'i-search',
  data () {
    return {
      formData: {}
    }
  },
  props: {
    model: {
      type: Object,
      defalut: () => {
        return {}
      }
    }
  },
  methods: {
    search () {
      this.$emit('search')
    },
    reset () {
      this.$refs.form.resetFields()
      this.$emit('reset')
    }
  }
}
</script>

<style lang="scss" scoped>
.i-search {
  padding: 10px;
  .el-form {
    // /deep/专门覆盖其他样式，增加权重，但他不能用于最外层，需要被包裹
    /deep/ .el-form-item {
      margin-bottom: 0;
       .el-form-item__label {
        width: 80px;
        // text-align: right;
        // padding: 0 10px;
      }
    }
  }
}
</style>
