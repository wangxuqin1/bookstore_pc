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
          <el-menu default-active="2" text-color="#333">
            <el-menu-item v-for="(item, index) in menuList" @click="getCurrentObject(item)" :key="index">
              <span>{{item.name}}</span>
            </el-menu-item>
          </el-menu>
      </el-aside>
      <el-container>
        <el-header>菜单管理</el-header>
        <el-main>
          <el-form ref="form" :inline="true" :model="MuneData">
          <el-row>
            <el-col :span="12">
              <el-form-item label="菜单名称" prop="name">
                <el-input v-model="this.CurrentData.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注" prop="remarks">
                <el-input v-model="this.CurrentData.remarks"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
           <el-row>
            <el-col :span="12">
              <el-form-item label="菜单路由" prop="menuRouting">
                <el-input v-model="this.CurrentData.menuRouting"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
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
            <el-form-item label="分类名称" prop="name">
              <el-input v-model="dialogFormData.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="dialogFormData.remarks"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单路由" prop="menuRouting">
              <el-input v-model="dialogFormData.menuRouting"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </i-dialog>
  </div>
</template>
<script>
import IDialog from '@/components/common/i-dialog'
import req from '@/api/mune-manage.js'
export default {
  name: 'menu-manage',
  data () {
    return {
      MuneData: {},
      classifyData: {},
      dialogFormData: {},
      CurrentData: {},
      menuCode: '',
      dialogTitle: '新增分类',
      dialogType: 'addMenu',
      dialogVisible: false,
      formRules: {
        test1: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ],
        test2: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ]
      },
      menuList: []
    }
  },
  components: {
    IDialog
  },
  created () {
    this.refresh()
  },
  methods: {
    add () {
      this.addMenu = 'addMenu'
      this.dialogTitle = '新增菜单'
      this.dialogVisible = true
    },
    update () {
      this.dialogTitle = '修改菜单'
      this.dialogVisible = true
      this.dialogType = 'updateMenuById'
      this.menuCode = this.CurrentData.menuCode
      this.getMenu()
    },
    deletes () {
      this.$confirm('此操作将永久删除该文件,是否继续?').then(() => {
        req('deleteMenu', {
          menuCode: this.CurrentData.menuCode
        }).then(data => {
          this.refresh()
          console.log('要删除的信息', data)
          this.$message.success(data.msg)
        })
      })
    },
    refresh () {
      req('listMenu', {
      }).then(data => {
        this.menuList = data.data
        console.log('查询菜单列表', data)
      })
    },
    getCurrentObject (item) {
      this.CurrentData = item
      console.log('获取当前的对象信息', this.CurrentData)
    },
    getMenu () {
      req('getMenu', {
        menuCode: this.menuCode
      }).then(data => {
        console.log('这里是查询单个菜单数据', data)
        this.dialogFormData = Object.assign({}, data.data)
      })
    },
    dialogCancel () {
      this.dialogVisible = false
      this.$refs.form.resetFields()
    },
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogType === 'addMenu') {
            req('addMenu', {
              ...this.dialogFormData
            }).then(data => {
              console.log(data)
              if (data.code === 0) {
                this.$message.success(data.msg)
                this.refresh()
                this.dialogVisible = false
              } else {
                this.$message.error(data.msg)
              }
            })
          } else {
            req('updateMenu', {
              ...this.dialogFormData
            }).then(data => {
              console.log(data)
              if (data.code === 0) {
                this.$message.success(data.msg)
                this.refresh()
                this.dialogVisible = false
              } else {
                this.$message.error(data.msg)
              }
              // this.CurrentData = null
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
.el-menu-item, .el-submenu__title {
  height: 32px;
  line-height: 32px;
  position: relative;
  box-sizing: border-box;
  white-space: nowrap;
  list-style: none;
}
.el-aside {
  height: 500px;
  border-right: 1px solid #999;
}
 .button {
   height: 60px;
   line-height: 60px;
   margin-left: 5px;
   text-align: center;
  }
.el-header {
  height: 61px;
  line-height: 60px;
  border-bottom: 1px solid #999;
}

.el-menu-item * {
    vertical-align: middle;
}
.el-menu-item[data-v-580dc6fc], .el-submenu__title[data-v-580dc6fc] {
    height: 32px;
    line-height: 32px;
    position: relative;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    white-space: nowrap;
    list-style: none;
}
.el-menu-item.is-active {
    color: black;
}
</style>
