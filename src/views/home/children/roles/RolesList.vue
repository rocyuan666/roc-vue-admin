<template>
  <div>
    <!-- 导航 -->
    <mbx-nav one-nav="权限管理" two-nav="角色列表"></mbx-nav>
    <!-- 卡片试图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-button class="addbtn" type="primary" @click="addRoles">添加角色</el-button>
      <!-- 内容 -->
      <el-table :data="rolesList" stripe border class="user-table">
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id" :class="['border-bot', i1==0 ? 'border-top' : '' ]">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeqxClick(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级,三级权限 -->
              <el-col :span="19">
                <el-row v-for="(item2, i2) in item1.children" :key="item2.id" :class="[i2==0 ? '' : 'border-top']">
                  <el-col :span="8">
                    <el-tag closable type="success" @close="removeqxClick(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="16">
                    <el-tag closable type="warning" v-for="item3 in item2.children" :key="item3.id" @close="removeqxClick(scope.row,item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="290">
          <template v-slot="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="editRole(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteRole(scope.row)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="btnFpqxClick(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限弹窗 -->
    <el-dialog
      title="分配权限"
      :visible.sync="boxQxshow"
      width="50%">
      <!-- 树形控件 -->
      <el-tree 
        :data="qxDataList" 
        :props="defaultProps" 
        default-expand-all 
        show-checkbox
        node-key="id"
        getCheckedKeys
        ref="treeRef"
        :default-checked-keys="activeArr"></el-tree>
      <span slot="footer">
        <el-button @click="boxQxshow = false">取 消</el-button>
        <el-button type="primary" @click="yesFpqxClick">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesPopShow"
      width="50%"
      @close="addRolesPopClose">
      <el-form ref="addFrom" :model="addFrom" :rules="addRules" label-width="80px" >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addFrom.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesPopShow = false">取 消</el-button>
        <el-button type="primary" @click="addRolesClick">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色 弹窗 -->
    <el-dialog
      title="添加角色"
      :visible.sync="editRolesPopShow"
      width="50%"
      @close="editRolesPopClose">
      <el-form ref="editFrom" :model="editFrom" :rules="editRules" label-width="80px" >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editFrom.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesPopShow = false">取 消</el-button>
        <el-button type="primary" @click="editRolesClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mbxNav from 'components/MbxNav'

import { getRightsList } from 'network/rights'

import { 
  getRolesList,
  delqx,
  addqx,
  addRolesData,
  editRolesData,
  deleteRoleData
 } from 'network/rights'

export default {
  name: 'RolesList',
  components: {
    mbxNav
  },
  data(){
    return {
      // 角色信息数据
      rolesList: [],
      // 分配权限弹窗显示
      boxQxshow: false,
      // 权限数据（树形）
      qxDataList: [],
      // 树形控件的展示设置
      defaultProps: {
        // 子节点的key
        children: 'children',
        // 显示内容的key
        label: 'authName'
      },
      // 默认选中的id数组
      activeArr: [],
      // 当前用户id
      roleId: 0,

      // 添加角色弹窗显示
      addRolesPopShow: false,
      // 添加角色信息
      addFrom: {
        roleName: '',
        roleDesc: ''
      },
      addRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
        ],
      },

      //编辑角色弹窗显示
      editRolesPopShow: false,
      // 编辑角色信息
      editId: '',
      editFrom: {
        roleName: '',
        roleDesc: ''
      },
      editRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
        ],
      },
    }
  },
  created(){
    this.getjsList()
  },
  methods: {
    /**
     * 添加角色
    */
    //  显示添加对话框
    addRoles(){
      this.addRolesPopShow = true
    },
    // 监听添加弹窗关闭
    addRolesPopClose(){
      this.$refs.addFrom.resetFields()
    },
    //确定添加
    addRolesClick(){
      this.$refs.addFrom.validate(valid => {
        if (!valid) {
          return
        }
        //发送添加请求
        addRolesData(this.addFrom).then(res => {
          if(res.data.meta.status !== 201){
            this.$message.error('添加失败')
            return 
          }
          this.$message.success('添加成功')
          this.addRolesPopShow = false
          this.getjsList()
        })
      })
    },

    /**
     * 编辑角色
     */
    //显示编辑角色弹窗
    editRole(roleInfo){
      this.editId = roleInfo.id
      this.editFrom.roleName = roleInfo.roleName
      this.editFrom.roleDesc = roleInfo.roleDesc
      this.editRolesPopShow = true
    },
    // 监听添加弹窗关闭
    editRolesPopClose(){
      this.$refs.editFrom.resetFields()
    },
    //确定修改编辑
    editRolesClick(){
      this.$refs.editFrom.validate(valid => {
        if (!valid) {
          return
        }
        //发送编辑修改请求
        editRolesData(this.editId, this.editFrom).then(res => {
          if(res.data.meta.status !== 200){
            this.$message.error('修改失败')
            return 
          }
          this.$message.success('修改成功')
          this.editRolesPopShow = false
          this.getjsList()
        })
      })
    },

    /**
     * 删除角色
     */
    deleteRole(roleInfo){
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除请求
        deleteRoleData(roleInfo.id).then(res => {
          if(res.data.meta.status !== 200){
            this.$message.error('删除失败'); 
            return
          }
          this.$message.success('删除成功');
          this.getjsList()
        })
      }).catch(() => {
        this.$message('已取消删除');          
      });
    },



    /**
     * 获取角色信息请求模块
     */
    getjsList(){
      getRolesList().then(res =>{
        // console.log(res)
        if(res.data.meta.status !== 200){
          this.$message.error('获取失败，请稍后刷新')
          return
        }
        this.rolesList = res.data.data
      })
    },
    /**
     * 删除当前角色的权限模块
     */
    removeqxClick(js,qxid){
      this.$confirm('此操作将永久删除权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        /**
         * 删除权限请求
         */
        delqx(js.id,qxid).then(res => {
          if(res.data.meta.status !== 200){
            // 请求删除失败
            this.$message.error('删除失败，请稍后重试')
            return
          }
          // 请求删除成功
          js.children = res.data.data;
          this.$message.success('删除成功')
        })
      }).catch(() => {
        // 取消删除
        this.$message('已取消')
      })
    },

    /**
     * 分配权限模块
     */
    //递归获取三级的权限
    getActiveArr(node,arr){
      // node没有children则是三级权限节点
      if(!node.children){
        return arr.push(node.id)
      }
      // node有children那么循环node.children数组，每一项在传进去递归
      for(let i in node.children){
        this.getActiveArr(node.children[i],arr)
      }
    },
    /* 点击分配权限 */
    btnFpqxClick(jsInfo){
      this.roleId = jsInfo.id
      /* 获取权限数据请求（树形结构） */
      getRightsList('tree').then(res => {
        // console.log(res)
        if(res.data.meta.status !== 200){
          this.$message.error('获取数据失败')
          return
        }
        this.qxDataList = res.data.data
      })
      // 展示默认之前清空数组 展示数组
      this.activeArr = []
      //展示默认的权限
      this.getActiveArr(jsInfo,this.activeArr)
      // 展示弹窗
      this.boxQxshow = true
    },
    /* 点击确定  分配权限 */
    yesFpqxClick(){
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),// 全选中
        ...this.$refs.treeRef.getHalfCheckedKeys()//半选中
      ]
      const strId = keys.join(',')
      // console.log(strId)
      // 发送请求
      addqx(this.roleId, strId).then(res => {
        // console.log(res)
        if(res.data.meta.status !== 200){
          this.$message.error('分配失败，请稍后再试')
          return
        }
        // 提示分配成功
        this.$message.success('分配成功')
        // 关闭弹窗
        this.boxQxshow = false
        // 刷新列表信息
        this.getjsList()
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .addbtn{
    margin-bottom: 20px;
  }
  .el-tag{
    margin:10px;
  }
  .border-bot{
    border-bottom: 1px solid #eee;
  }
  .border-top{
    border-top: 1px solid #eee;
  }
  .el-row{
    display: flex;
    align-items: center;
  }
  
</style>