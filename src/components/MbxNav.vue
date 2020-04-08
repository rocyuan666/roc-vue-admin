<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <!-- :to="{ path: '/home' }" -->
    <el-breadcrumb-item>首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{oneNav}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{twoNav}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'MbxNav',
  props: {
    oneNav: '',
    twoNav: ''
  }
}
</script>

<style lang="less" scoped>

</style>