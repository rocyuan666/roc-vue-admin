<template>
  <el-container class="home-page">
    <!-- 头部 -->
    <el-header>
      <div class="home-welcome">
        <img src="~assets/img/logo.jpg" alt="">
        <span>RocYuan商城管理</span>
      </div>
      <el-button type="info" @click="logoutClick">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '66px' : '200px'">
        <!-- 折叠按钮 -->
        <p class="btn-zd" @click="zdClick" >|||</p>
        <!-- 侧边菜单 -->
        <el-menu
          :default-active="activePath"
          class="aside-nav"
          background-color="#1265a6"
          text-color="#e0e0e0"
          active-text-color="#12aa9c"
          :unique-opened="true"
          :collapse="isCollapse"
          router
          :collapse-transition="false">
          <!-- 每次只能展开一个 unique-opened="true" -->
          <!-- 导航一 -->
          <el-submenu :index="item.path" v-for="(item, index) in menusList" :key="index">
            <template slot="title">
              <i class="icon-color" :class="menuIcon[index]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menuItem :index="'/' + i.path" v-for="(i, j) in item.children" :key="j" @click="itemClick(i.path)">
              <template slot="title">
                <i class="icon-color el-icon-menu"></i>
                <span>{{i.authName}}</span>
              </template>
            </el-menuItem>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenus } from 'network/home'

export default {
  name: 'Home',
  data(){
    return {
      menusList:[],
      menuIcon: ['el-icon-s-custom', 'el-icon-s-operation', 'el-icon-s-goods', 'el-icon-s-order', 'el-icon-s-data'],
      isCollapse: false,
      activePath:''
    }
  },
  methods: {
    /**
     * 注销账号模块
     */
    logoutClick(){
      window.sessionStorage.clear()
      this.$message('账号已注销')
      this.$router.push('/login')
    },
    /**
     * 折叠侧边栏模块
     */
    zdClick(){
      this.isCollapse = !this.isCollapse
    },
    /**
     * 二级菜单被点击模块
     */
    itemClick(path){
      this.activePath = '/' + path
      // console.log(path)
      // 保存当前激活的菜单path
      window.sessionStorage.setItem('activePath',this.activePath)
    }
  },
  created(){
    /**
     * 侧边栏数据请求处理模块
     */
    getMenus().then((res) => {
      this.menusList = res.data.data
    })
    // 获取当前激活的菜单path
    this.activePath = window.sessionStorage.getItem('activePath')
  }
}
</script>

<style lang="less" scoped>
  .home-page{
    height: 100%;
  }
  .el-header{
    background-color: #2376b7;
    display: flex;
    justify-content: space-between;
    align-items: center;
    >div{
      display: flex;
      align-items: center;
      img{
        display: inline-block;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #fff;
      }
    }
    span{
      font-size: 16px;
      color:#fff;
      padding-left: 10px;
    }
  }
  .el-aside{
    overflow-x: hidden;
    background-color: #1265a6;
    transition: width .3s;
  }
  .el-menu{
    border-right: none;
  }
  .el-main{
    background-color: #d8e3e7;
  }
  .icon-color{
    color:#e0e0e0;
    margin-right: 5px;
  }
  .btn-zd{
    text-align: center;
    color:#e0e0e0;
    background-color: #0f59a4;
    height: 30px;
    line-height: 28px;
    box-shadow: 0 0 2px #0f59a4;
    cursor: pointer;
    user-select:none;
  }
</style>