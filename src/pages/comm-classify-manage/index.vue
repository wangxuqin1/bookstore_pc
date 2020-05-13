<template>
  <div class="mune-manage">
    <el-container class="waikuang">
        <el-aside>
          <div class="button">
            <el-button @click="add" type="primary">新增</el-button>
            <el-button @click="update" type="primary">修改</el-button>
            <el-button @click="deletes" type="primary">删除</el-button>
            <el-button @click="refresh" type="primary">刷新</el-button>
          </div>
          <div class="tree">
            <el-tree ref="tree" :data="datas" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
          </div>
      </el-aside>
      <el-container>
        <el-header>分类详情</el-header>
        <el-main>
          <div>
            <el-form ref="form" :inline="true" :model="classifyData">
            <el-row>
              <el-col :span="12">
                <el-form-item label="分类名称" prop="className">
                  <el-input v-model="this.className"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注" prop="comment">
                  <el-input v-model="this.comment"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          </div>
        </el-main>
      </el-container>
    </el-container>
    <i-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      @dialog-before-close="dialogBeforeClose"
      @dialog-cancel="dialogCancel"
      @dialog-confirm="dialogConfirm">
      <el-form :model="dialogFormData" ref="form" :rules="formRules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="分类名称" prop="className">
              <el-input v-model="dialogFormData.className"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="comment">
              <el-input v-model="dialogFormData.comment"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </i-dialog>
  </div>
</template>

<script>
import IDialog from '@/components/common/i-dialog'
import req from '@/api/comm-classify-manage.js'
export default {
  name: 'menu-manage',
  data () {
    return {
      classifyData: {},
      dialogFormData: {
        className: '',
        comment: ''
      },
      listGoods: {},
      getCurrentData: {},
      dialogTitle: '新增分类',
      dialogType: 'addGoodsClass',
      classOneCode: '',
      classSecondCode: '',
      className: '',
      comment: '',
      classCode: '',
      version: 0,
      dialogVisible: false,
      formRules: {
        test1: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ],
        test2: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ]
      },
      datas: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1'
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1'
        }, {
          label: '二级 2-2'
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1'
        }, {
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'ificationSecondList',
        label: 'classSecondName'
      }
    }
  },
  created () {
    this.refresh()
  },
  methods: {
    add () {
      this.dialogType = 'addGoodsClass'
      this.dialogTitle = '新增商品类别'
      this.dialogVisible = true
      this.classOneCode = ''
      if (this.getCurrentData.classOneCode !== '' || this.getCurrentData.classOneCode !== undefined) {
        this.classOneCode = this.getCurrentData.classOneCode
      } else {
        this.classOneCode = ''
      }
    },
    deletes () {
      if (this.classCode !== '' && this.classCode !== undefined) {
        this.$confirm('此操作将永久删除该商品类别,是否继续?').then(() => {
          req('deleteGoodsClass', {
            classCode: this.classCode
          }).then(data => {
            this.$message.success(data.msg)
            this.refresh()
          })
        })
      } else {
        this.$message.error('请选择你要删除的商品类别')
      }
    },
    update () {
      this.dialogTitle = '修改商品类别'
      this.dialogVisible = true
      this.dialogType = 'updateGoodsClass'
      this.classOneCode = ''
      this.classSecondCode = ''
      console.log('this.getCurrentData.classOneCodes', this.getCurrentData.classOneCode)
      console.log('this.getCurrentData.classSecondCodes', this.getCurrentData.classSecondCode)
      if (this.getCurrentData.classOneCode !== '' && this.getCurrentData.classOneCode !== undefined) {
        this.classOneCode = this.getCurrentData.classOneCode
        console.log('this.classOneCode', this.classOneCode)
        this.getGoodsClass(this.classOneCode)
      } else if (this.getCurrentData.classSecondCode !== '' && this.getCurrentData.classSecondCode !== undefined) {
        this.classSecondCode = this.getCurrentData.classSecondCode
        console.log('this.classSecondCode', this.classSecondCode)
        this.getGoodsClass(this.classSecondCode)
      } else {
        console.log('3')
        this.$message.error('请选择你要修改的商品类别')
      }
    },
    getGoodsClass (value) {
      console.log('classCode', value)
      req('getGoodsClass', {
        classCode: value
      }).then(data => {
        console.log('这里是查询单个商品类别', data)
        // this.className = data.className
        this.version = data.data.version
        this.classCode = data.data.classCode
        this.className = data.data.className
        this.dialogFormData = Object.assign({}, data.data)
      })
    },
    refresh () {
      req('listGoodsClass', {
      }).then(data => {
        console.log('这里是分类列表数据', data)
        this.datas = data.data.map(item => {
          return Object.assign({}, item, {classSecondCode: item.classOneCode, classSecondName: item.classOneName})
        })
        // this.listGoods = data
        // toTreeData(data,id,pid,name)
      })
    },
    handleNodeClick (data) {
      console.log('节点信息', data)
      this.getCurrentData = data
      if (this.getCurrentData.classOneName !== '' && this.getCurrentData.classOneName !== undefined) {
        this.className = this.getCurrentData.classOneName
        this.comment = this.getCurrentData.comment
        this.classCode = this.getCurrentData.classOneCode
      } else if (this.getCurrentData.classSecondName !== '' && this.getCurrentData.classSecondName !== undefined) {
        this.className = this.getCurrentData.classSecondName
        this.comment = this.getCurrentData.comment
        this.classCode = this.getCurrentData.classSecondCode
      }
    },
    dialogCancel () {
      this.$refs.form.resetFields()
      this.dialogVisible = false
    },
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogType === 'addGoodsClass') {
            console.log('this.dialogFormData', this.dialogFormData)
            req('addGoodsClass', {
              classOneCode: this.classOneCode,
              className: this.dialogFormData.className,
              comment: this.dialogFormData.comment
            }).then(data => {
              console.log(data)
              if (data.code === 0) {
                this.$message.success(data.msg)
                this.refresh()
                this.$refs.form.resetFields()
                this.dialogVisible = false
              } else {
                this.$message.error(data.msg)
              }
            })
          } else {
            console.log('this.dialogFormData', this.dialogFormData)
            console.log('this.classCode', this.classCode)
            console.log('this.version', this.version)
            console.log('this.dialogFormData.className,', this.dialogFormData.className)
            console.log('this.dialogFormData.classCode,', this.dialogFormData.comment)
            req('updateGoodsClass', {
              classCode: this.classCode,
              className: this.dialogFormData.className,
              comment: this.dialogFormData.comment,
              version: this.version
            }).then(data => {
              console.log(data)
              if (data.code === 0) {
                this.$message.success(data.msg)
                this.dialogVisible = false
                this.$refs.form.resetFields()
                this.refresh()
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
    }
    // toTreeData(data,id,pid,name) {
    // 建立个树形结构,需要定义个最顶层的父节点，pId是1
    // let parent = [];
    // for (let i = 0; i < data.length; i++) {
    //     if(data[i][pid] !== "1"){
    //     }else{
    //       let obj = {
    //         label: data[i][name],
    //         id: data[i][id],
    //         children: []
    //       };
    //       parent.push(obj);//数组加数组值
    //     }
    // console.log(obj);
    // console.log(parent,"bnm");
    // }
  },
  components: {
    IDialog
  }
}
</script>

<style lang="scss" scoped>
.mune-manage {
  padding: 20px;
}
.waikuang {
  border: 1px solid #999;
}
.el-menu {
  border-top: 1px solid #999;
}
.el-aside {
  height: 550px;
  border-right: 1px solid #999;
}
 .button {
   height: 60px;
   line-height: 60px;
   text-align: center;
   border-bottom: 1px solid #999;
  }
.el-header {
  height: 61px;
  line-height: 60px;
  border-bottom: 1px solid #999;
}
.tree {
  margin-left: 20px;
}
</style>
