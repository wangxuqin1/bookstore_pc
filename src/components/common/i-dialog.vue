<template>
  <div>
    <el-dialog
    :title="title"
    :visible.sync="visible"
    width="65%"
    :before-close="dialogBeforeClose"
    @close="dialogClose">
    <slot></slot>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogCancel">取消</el-button>
      <el-button @click="dialogConfirm" type="primary">确定</el-button>
    </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'i-dialog',
  data () {
    return {
      visible: false
    }
  },
  props: {
    value: {
      type: Boolean,
      defalut: false
    },
    title: {
      type: String,
      defalut: ''
    }
  },
  methods: {
    dialogClose () {
      this.visible = false
      this.$emit('input', this.visible)
    },
    dialogCancel () {
      this.$emit('dialog-cancel')
    },
    dialogConfirm () {
      this.$emit('dialog-confirm')
    },
    dialogBeforeClose () {
      this.$emit('dialog-before-close')
      this.visible = false
    }
  },
  watch: {
    value: {
      handler (value) {
        this.visible = value
      },
      deep: true
    }
  }
}
</script>
