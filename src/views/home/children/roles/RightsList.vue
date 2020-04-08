<template>
  <div>
    <!-- 导航 -->
    <mbx-nav one-nav="权限管理" two-nav="权限列表"></mbx-nav>
    <!-- 卡片试图 -->
    <el-card>
      <el-table :data="rightsList" stripe border class="user-table">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level == 0">一级</el-tag>
            <el-tag v-else-if="scope.row.level == 1" type="success">二级</el-tag>
            <el-tag v-else type="danger">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import mbxNav from 'components/MbxNav'

import { getRightsList } from 'network/rights'

export default {
  name: 'RightsList',
  components: {
    mbxNav
  },
  data(){
    return {
      rightsList:[]
    }
  },
  created(){
    /**
     * 获取权限信息列表
     * 
     */
    getRightsList('list').then((res) => {
      if(res.data.meta.status === 200){
        this.rightsList = res.data.data
      }
    })
  }
}
</script>

<style lang="less" scoped>

</style>