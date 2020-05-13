<template>
  <div>
    <el-dialog
    :title="title"
    :visible.sync="visible"
    width="50%"
    :before-close="dialogBeforeClose2"
    @close="dialogClose2">
    <slot></slot>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogCancel2">取消</el-button>
      <el-button @click="dialogConfirm2" type="primary">确定</el-button>
    </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'i-dialog2',
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
    dialogClose2 () {
      this.visible = false
      this.$emit('input', this.visible)
    },
    dialogCancel2 () {
      this.$emit('dialog-cancel2')
    },
    dialogConfirm2 () {
      this.$emit('dialog-confirm2')
    },
    dialogBeforeClose2 () {
      this.$emit('dialog-before-close2')
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
