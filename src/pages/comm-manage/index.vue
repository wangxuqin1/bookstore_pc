<template>
  <div>
    <i-search ref="isearch" :model="formData" @search="fetch" @reset="reset">
      <el-form-item label="商品名称" prop="goodsName">
        <el-input v-model="formData.goodsName"></el-input>
      </el-form-item>
       <el-form-item label="商品状态" prop="goodsStatus">
         <el-select v-model="formData.goodsStatus" placeholder="全部">
           <el-option label="全部" value="0"></el-option>
           <el-option label="在售" value="2"></el-option>
           <el-option label="已下架" value="3"></el-option>
           <el-option label="未发布" value="1"></el-option>
         </el-select>
      </el-form-item>
      <el-form-item label="广告词" prop="advWords">
        <el-input v-model="formData.advWords"></el-input>
      </el-form-item>
      <el-form-item label="出版社" prop="press">
        <el-input v-model="formData.press"></el-input>
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input v-model="formData.author"></el-input>
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
       width="120"
       align="center"
       >
       </el-table-column>
    </i-table>
    <i-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      @dialog-before-close="dialogBeforeClose"
      @dialog-cancel="dialogCancel"
      @dialog-confirm="dialogConfirm">
      <el-form :model="dialogFormData" ref="form" :rules="formRules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="商品名称" prop="goodsName">
              <el-input v-model="dialogFormData.goodsName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="书号" prop="bookCode">
              <el-input v-model="dialogFormData.bookCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="一级分类" prop="classOneName">
              <el-select @focus="listClassOne" @change="listClassSecond(dialogFormData.classOneName)" v-model="dialogFormData.classOneName" placeholder="请选择">
                <el-option v-for="(item, index) in this.firstClass" :key="index" :label="item.classOneName" :value="`${item.classOneName}|${item.classOneCode}`"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="二级分类" prop="classSecondName">
              <el-select v-model="dialogFormData.classSecondName" @change="listClassSeconds(dialogFormData.classSecondName)" placeholder="请选择">
                <el-option v-for="(item, index) in this.secondClass" :key="index" :label="item.classSecondName" :value="`${item.classSecondName}|${item.classSecondCode}`">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="广告词" prop="advWords">
              <el-input  type="textarea" style="width:220px" v-model="dialogFormData.advWords"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品介绍" prop="goodsIntro">
              <el-input  type="textarea" style="width:220px" v-model="dialogFormData.goodsIntro"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
         <el-row>
          <el-col :span="12">
            <el-form-item label="商家名称" prop="merchant">
              <el-select v-model="dialogFormData.merchant" placeholder="请选择">
                <el-option label="当当网" value="当当网"></el-option>
                <el-option label="新华书店" value="新华书店"></el-option>
                <el-option label="先锋书店" value="先锋书店"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库存" prop="stock">
              <el-input v-model="dialogFormData.stock"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="销售价" prop="sellPrice">
              <el-input v-model="dialogFormData.sellPrice"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出版社" prop="press">
              <el-input v-model="dialogFormData.press"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="作者" prop="author">
              <el-input v-model="dialogFormData.author"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- <el-form-item label="上传图片" ref="uploadElement" prop="imageUrl">
              <input id="file" type="file" @change="inputChange($event)"/>
            </el-form-item> -->
            <el-form-item label="上传图片" ref="uploadElement" prop="imageUrl">
              <div class="a-upload">
                <input id="file" type="file" @change="inputChange($event)"/>点击上传
              </div>
              <el-image
                v-show="isDisplay"
                style="width: 40px; height: 40px;border-radius:50%; display: inline-block; margin-left=20px"
                :src="dialogFormData.image"
                v-model="dialogFormData.image"
              >
              </el-image>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </i-dialog>
  </div>
</template>

<script>
import ISearch from '@/components/common/i-seaarch'
import ITable from '@/components/common/i-table'
import IDialog from '@/components/common/i-dialog'
import req from '@/api/comm-manage.js'
import axios from 'axios'

export default {
  name: 'comm-manage',
  components: {
    ISearch,
    ITable,
    IDialog
  },
  data () {
    return {
      formData: {},
      dialogFormData: {
        goodsName: '',
        bookCode: '',
        classSecondCode: '',
        advWords: '',
        goodsIntro: '',
        press: '',
        author: '',
        merchant: '',
        stock: '',
        sellPrice: '',
        image: ''
      },
      firstClass: {},
      secondClass: {},
      classOne: {},
      getDataCode: {},
      dialogVisible: false,
      dialogTitle: '新增商品',
      dialogType: 'addGoods',
      batchdeletion: '',
      goodsStatus: '',
      imageUrls: '',
      goodsCode: '',
      isDisplay: false,
      pageInfo: {
        pageIndex: 1,
        pageSize: 5,
        total: 0
      },
      toolbar: [
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            this.isDisplay = false
            this.dialogType = 'addGoods'
            this.dialogTitle = '新增商品'
            this.dialogVisible = true
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            if (this.getDataCode.length === undefined) {
              this.$message.error('请选择你要修改的商品')
            } else if (this.getDataCode.length === 1) {
              this.isDisplay = true
              this.dialogTitle = '修改商品'
              this.dialogVisible = true
              this.dialogType = 'updateUser'
              this.goodsCode = this.getDataCode[0].goodsCode
              this.getGoods()
              console.log(this.pageInfo)
            } else {
              this.$message.error('目前只能一次修改一个商品')
            }
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            if (this.getDataCode.length === undefined || this.getDataCode === null) {
              this.$message.error('请选择你要删除的商品')
            } else if (this.getDataCode.length >= 1) {
              this.$confirm('此操作将永久删除该商品,是否继续?').then(() => {
                this.batchdeletion = ''
                for (let i = 0; i < this.getDataCode.length; i++) {
                  if (i < this.getDataCode.length - 1) {
                    console.log('i的值', i)
                    this.batchdeletion += this.getDataCode[i].goodsCode
                    this.batchdeletion += ','
                  } else {
                    console.log('i的值', i)
                    this.batchdeletion += this.getDataCode[this.getDataCode.length - 1].goodsCode
                  }
                }
                console.log('批量删除', this.batchdeletion)
                this.goodsCode = this.batchdeletion
                this.deleteGoods(this.goodsCode)
                console.log(this.pageInfo)
              })
            }
          }
        },
        {
          btnName: '上架',
          type: 'primary',
          func: () => {
            if (this.getDataCode.length === undefined) {
              this.$message.error('请选择你要上架的商品')
            } else if (this.getDataCode.length >= 1) {
              this.batchdeletion = ''
              for (let i = 0; i < this.getDataCode.length; i++) {
                if (i < this.getDataCode.length - 1) {
                  console.log('i的值', i)
                  this.batchdeletion += this.getDataCode[i].goodsCode
                  this.batchdeletion += ','
                } else {
                  console.log('i的值', i)
                  this.batchdeletion += this.getDataCode[this.getDataCode.length - 1].goodsCode
                }
              }
              console.log('批量上架', this.batchdeletion)
              this.goodsCode = this.batchdeletion
              this.goodsStatus = 2
              this.upGoodsStatus(this.goodsCode, this.goodsStatus)
              console.log(this.pageInfo)
            } else {
              this.$message.error('目前只能一次上架一个商品，请重新选择')
            }
          }
        },
        {
          btnName: '下架',
          type: 'primary',
          func: () => {
            if (this.getDataCode.length === undefined) {
              this.$message.error('请选择你要下架的商品')
            } else if (this.getDataCode.length >= 1) {
              this.batchdeletion = ''
              for (let i = 0; i < this.getDataCode.length; i++) {
                if (i < this.getDataCode.length - 1) {
                  console.log('i的值', i)
                  this.batchdeletion += this.getDataCode[i].goodsCode
                  this.batchdeletion += ','
                } else {
                  console.log('i的值', i)
                  this.batchdeletion += this.getDataCode[this.getDataCode.length - 1].goodsCode
                }
              }
              console.log('批量下架', this.batchdeletion)
              this.goodsCode = this.batchdeletion
              this.goodsStatus = 3
              this.upGoodsStatus(this.goodsCode, this.goodsStatus)
              console.log(this.pageInfo)
            }
          }
        }
      ],
      columnList: [
        {label: '商品名称', prop: 'goodsName'},
        {label: '售价', prop: 'sellPrice'},
        {label: '销售量', prop: 'salesVolume'},
        {label: '一级分类', prop: 'classOneName'},
        {label: '二级分类', prop: 'classSecondName'},
        {label: '广告词', prop: 'advWords'},
        {label: '商品介绍', prop: 'goodsIntro'},
        {label: '商品状态', prop: 'goodsStatus'},
        {label: '上架时间', prop: 'shelfTime'},
        {label: '浏览量', prop: 'browseVolume'},
        {label: '商家名称', prop: 'merchant'},
        {label: '库存', prop: 'stock'},
        {label: 'isbn书号', prop: 'bookCode'}
      ],
      tableData: [
      ],
      formRules: {
        goodsName: [
          {required: true, message: '请输入商品名称', trigger: 'change'}
        ],
        bookCode: [
          {required: true, message: '请输入商品编号', trigger: 'change'}
        ],
        classOneName: [
          {required: true, message: '请选择一级分类名', trigger: 'change'}
        ],
        classSecondName: [
          {required: true, message: '请选择二级分类名', trigger: 'change'}
        ],
        advWords: [
          {required: true, message: '请输入商品广告词', trigger: 'change'}
        ],
        goodsIntro: [
          {required: true, message: '请输入商品介绍', trigger: 'change'}
        ],
        merchant: [
          {required: true, message: '请选择商家', trigger: 'change'}
        ],
        sellPrice: [
          {required: true, message: '请输入销售价', trigger: 'change'}
        ],
        press: [
          {required: true, message: '请输入出版社', trigger: 'change'}
        ],
        author: [
          {required: true, message: '请输入作者姓名', trigger: 'change'}
        ],
        stock: [
          {required: true, message: '请输入库存量', trigger: 'change'}
        ]
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
    search () {
      req('listGoods', {
        ...this.formData,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageIndex
      }).then(data => {
        this.tableData = data.data.list
        this.pageInfo.pageIndex = data.data.pageNum
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.total = data.data.total
        console.log(data)
        this.tableData.forEach(item => {
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
    getGoods () {
      req('getGoods', {
        goodsCode: this.goodsCode
      }).then(data => {
        console.log('这里是查询数据', data)
        this.dialogFormData = Object.assign({}, data.data)
        console.log(' 查询this.dialogFormData ', this.dialogFormData)
      })
    },
    deleteGoods (value) {
      console.log('删除的编号', value)
      req('deleteGoods', {
        goodsCode: value
      }).then(data => {
        this.fetch()
        this.$message.success(data.msg)
      })
    },
    upGoodsStatus (value1, value2) {
      req('updateGoodsStatus', {
        goodsCode: value1,
        goodsStatus: value2
      }).then(data => {
        console.log('修改商品状态', data)
        this.fetch()
        this.$message.success(data.msg)
      })
    },
    downGoodsStatus (value1, value2) {
      req('updateGoodsStatus', {
        goodsCode: value1,
        goodsStatus: value2
      }).then(data => {
        this.fetch()
        console.log('修改商品状态', data)
        this.$message.success(data.msg)
      })
    },
    inputChange (event) {
      let form = new FormData()
      let file = document.getElementById('file').files[0]
      console.log('files', file)
      form.append('file', file, file.name)
      form.append('access_token', JSON.parse(sessionStorage.getItem('userInfo')).access_token)
      axios({
        method: 'post',
        url: 'http://p2991w6815.oicp.vip/pc/image/upload',
        data: form,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(data => {
        console.log('data的值', data)
        this.imageUrls = data.data.data
        if (this.imageUrls) {
          this.dialogFormData.image = this.imageUrls
          console.log('图片路径', this.dialogFormData.image)
          this.isDisplay = true
        } else {
          this.isDisplay = false
        }
      })
    },
    listClassOne () {
      console.log('触发了一级分类查询')
      req('listClassOne', {
      }).then(data => {
        this.firstClass = data.data
        console.log('一级分类数据：', data)
      })
    },
    listClassSecond (value) {
      value = value.split('|')
      this.dialogFormData.classOneCode = value[1]
      this.dialogFormData.classOneName = value[0]
      console.log('一级分类的编码', value)
      req('listClassSecond', {
        classOneCode: value[1]
      }).then(data => {
        this.secondClass = data.data
        console.log('二级分类数据：', data)
      })
    },
    listClassSeconds (value) {
      value = value.split('|')
      this.dialogFormData.classSecondCode = value[1]
      this.dialogFormData.classSecondName = value[0]
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
      // this.getTableData()
      this.search()
      console.log('当前第几页', value)
    },
    handleSelectionChange (rows) {
      this.getDataCode = rows
      console.log('rows', rows)
    },
    dialogCancel () {
      this.$refs.form.resetFields()
      this.dialogVisible = false
    },
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogType === 'addGoods') {
            // this.dialogFormData.image = this.imageUrls
            console.log('this.dialogFormData', this.dialogFormData)
            req('addGoods', {
              ...this.dialogFormData
            }).then(data => {
              console.log(data)
              if (data.code === 0) {
                this.$message.success(data.msg)
                this.fetch()
                this.$refs.form.resetFields()
                this.dialogVisible = false
              } else {
                this.$message.error(data.msg)
              }
            })
          } else {
            console.log('this.dialogFormData', this.dialogFormData)
            req('updateGoods', {
              ...this.dialogFormData
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
    }
  }
}
</script>

<style lang="scss" scoped>
.a-upload {
  padding: 4px 10px;
  height: 20px;
  line-height: 20px;
  position: relative;
  cursor: pointer;
   color: white;;
  background: #409EFF;
  border: 1px solid #ddd;
  border-radius: 0px;
  overflow: hidden;
  display: inline-block;
  *display: inline;
  *zoom: 1
}
.a-upload  input {
  position: absolute;
  font-size: 14px;
  right: 0;
  top: 0;
  opacity: 0;
  filter: alpha(opacity=0);
  cursor: pointer
}

</style>
