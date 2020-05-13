<template>
  <div>
    <el-container>
      <el-header height="70px">
        <router-link to="/">行走书店管理系统</router-link>
        <el-dropdown trigger="hover">
          <div class="user-info">
            <!-- <img src="@/images/home-page/u18.jpg"> -->
              <el-image
                style="width: 50px; height: 50px;border-radius:20px"
                :src="this.role.userImg"
              >
              </el-image>&nbsp;&nbsp;
            <span>{{this.role.userName}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <div class="loginout">
          <span></span>
        </div> -->
      </el-header>

      <el-container>
        <el-aside width="200px">
          <el-menu @select="handlerSelect">
             <el-menu-item v-for="(item, index) in getMenuObject" :index="item.menuRouting" :key="index">
              <span slot="title">{{item.name}}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import req from '@/api/mune-manage.js'
export default {
  name: 'Home',
  data () {
    return {
      role: {},
      roleName: '',
      getMenuObject: []
    }
  },
  created () {
    req('listMenu', {
    }).then(data => {
      this.getMenuObject = data.data
      console.log('查询菜单列表', data)
      for (let i = 0; i < this.getMenuObject.length; i++) {
        if (this.getMenuObject[i].name === '用户管理') {
          this.getMenuObject[i].menuRouting = '/user-manage'
        } else if (this.getMenuObject[i].name === '菜单管理') {
          this.getMenuObject[i].menuRouting = '/menu-manage'
        } else if (this.getMenuObject[i].name === '商品管理') {
          this.getMenuObject[i].menuRouting = '/comm-manage'
        } else if (this.getMenuObject[i].name === '首页轮播图管理') {
          this.getMenuObject[i].menuRouting = '/home-pic-manage'
        } else if (this.getMenuObject[i].name === '商品分类管理') {
          this.getMenuObject[i].menuRouting = '/comm-classify-manage'
        } else if (this.getMenuObject[i].name === '客户管理') {
          this.getMenuObject[i].menuRouting = '/client-manage'
        } else if (this.getMenuObject[i].name === '订单管理') {
          this.getMenuObject[i].menuRouting = '/order-manage'
        } else if (this.getMenuObject[i].name === '热门商品位管理') {
          this.getMenuObject[i].menuRouting = '/hot-comm-manage'
        } else if (this.getMenuObject[i].name === '门店信息管理') {
          this.getMenuObject[i].menuRouting = '/shop-info-manage'
        } else if (this.getMenuObject[i].name === '司机信息管理') {
          this.getMenuObject[i].menuRouting = '/driver-info-manage'
        }
      }
    })
    this.getRole()
  },
  methods: {
    handlerSelect (key, path) {
      if (key !== this.$router.path) {
        this.$router.replace({path: key})
      }
    },
    getRole () {
      req('userMessage', {
      }).then(data => {
        this.role = data.data
        console.log('姓名：', this.role.userImg)
        console.log('获取角色信息', data)
      })
    },
    loginout () {
      console.log('点击了退出登录事件')
      sessionStorage.clear('roleInfo')
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="scss" scoped>
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgb(242, 242, 242);
}
.el-main {
  padding: 0;
}
.router-link-active {
  font-size: 25px;
  color: #409Eff;
  text-decoration: none;
}
.user-info {
  display: flex;
  align-items: center;
  height: 100%;
  cursor: pointer;
}
img {
  margin-right: 20px;
}
</style>
