<template>
  <div class="container">
    <div class="login-form">
      <div class="title"><span>请登录</span></div>
      <el-form :model="UserData" :rules="formRules">
        <el-form-item prop="username">
          <el-input style="width:250px; border-radius: 10px;" v-model="UserData.username" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input style="width:250px; border-radius: 10px;" :show-password="true" v-model="UserData.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
import req from '@/api/mune-manage.js'
// const qs = require('qs')
export default {
  name: 'login',
  data () {
    return {
      UserData: {
        username: '',
        password: ''
      },
      formRules: {
        username: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ],
        password: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    login () {
      axios({
        method: 'post',
        url: 'http://p2991w6815.oicp.vip/uaa/auth/form',
        data: qs.stringify(this.UserData),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;'
        }
      }).then(data => {
        console.log(data)
        if (data.data.code === 0) {
          this.$message({
            type: 'success',
            message: data.data.msg
          })
          sessionStorage.setItem('userInfo', JSON.stringify(data.data.data))
          this.getRole()
        } else {
          this.$message({
            type: 'error',
            message: data.data.msg
          })
        }
      })
    },
    getRole () {
      req('userMessage', {
      }).then(data => {
        this.role = data.data.role
        // console.log('姓名：', this.role.userImg)
        console.log('获取角色信息22', data)
        if (this.role === 1) {
          this.$router.push({path: 'user-manage'})
        } else {
          this.$router.push({path: 'client-manage'})
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: url('../assets/u0.jpg') no-repeat;
  background-size: 100% 100%;
  text-align: center;
  .login-form {
    position: absolute;
    // margin-top: 20px;
    top: 40%;
    right: 80px;
    transform: translate(0, -50%);
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.3);
    padding: 20px;
    box-sizing: border-box;
    //border-radius: 10px;
    .el-form {
      .el-form-item {
        .el-form-item__content {
           .el-input{
             .el-input__inner {
              border-radius: 5px;
              height: 30px;
            }
          }
          .el-button {
            display: block;
            margin: 0 auto;
          }
        }
      }
    }
  }
}
.title {
  text-align: center;
  font-size: 18px;
  margin-top: 5px;
  margin-bottom: 30px;
  color: white;
}

</style>
