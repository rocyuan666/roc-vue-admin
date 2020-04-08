<template>
  <div>
    <!-- 导航 -->
    <mbx-nav one-nav="用户管理" two-nav="用户列表"></mbx-nav>
    <!-- 卡片试图 -->
    <el-card>
      <!-- 操作 区域 -->
      <el-row :gutter="30">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUsersInfo">
            <el-button slot="append" icon="el-icon-search" @click="getUsersInfo"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUser">添加</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表表格 区域 -->
      <el-table :data="userList" stripe border class="user-table">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <!-- 作用于插槽 取出本行数据 (在父组件中使用了子组件，在子组件插槽中（标签区域）需要获取子组件的数据  v-slot="xxx"   xxx.row:子组件数据) -->
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="changeUserState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="176">
          <template v-slot="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="changeUserInfo(scope.row)"></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="delClick(scope.row)"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable='false'>
              <el-button size="mini" type="warning" icon="el-icon-setting" @click="allotClick(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserShow"
      width="50%"
      :before-close="addClose">
      <el-form :rules="rules" ref="addForm" :model="addForm" label-width="70px">
        <el-form-item label="用户名" prop='username'>
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop='password'>
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop='email'>
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop='mobile'>
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addClose">取 消</el-button>
        <el-button type="primary" @click="addClick">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="changeUserShow"
      width="50%"
      :before-close="changeClose">
      <el-form :rules="rules" ref="changeForm" :model="changeForm" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="changeForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop='email'>
          <el-input v-model="changeForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop='mobile'>
          <el-input v-model="changeForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeClose">取 消</el-button>
        <el-button type="primary" @click="changeClick">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色弹窗 -->
    <el-dialog
      title="分配角色"
      :visible.sync="allotShow"
      width="50%"
      @close="allotClose">
      <p class="text">当前的用户：{{userInfo.username}}</p>
      <p class="text">当前的角色：{{userInfo.role_name}}</p>
      <p class="text-sel">分配新角色：
        <el-select v-model="selValue" placeholder="请选择">
        <el-option
          v-for="item in jsList"
          :key="item.id"
          :label="item.roleName"
          :value="item.id">
        </el-option>
      </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="allotShow = false">取 消</el-button>
        <el-button type="primary" @click="yesAllotClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mbxNav from 'components/MbxNav'
import { 
  getUsers,
  changeState,
  addUserInfo,
  queryIdUser,
  changeUser,
  delUsers,
  allotJsList,
  allotJs
  } from 'network/home'

export default {
  name: 'UserList',
  components: {
    mbxNav
  },
  data(){
    /**
     * 邮箱验证规则
     */
    var validateEmail = (rule, value, cb) => {
      // 验证邮箱的正则
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if(regEmail.test(value)){
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    };

    /**
     * 手机号验证规则
     */
    var validateMobile = (rule, value, cb) => {
      // 验证手机号正则
      const regMobile = /^1[34578]\d{9}$/
      if(regMobile.test(value)){
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      userList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 4
      },
      // 全部用户个数
      total: 0,
      // 添加用户对话框 显示隐藏
      addUserShow: false,
      // 添加用户数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 修改用户对话框 显示隐藏
      changeUserShow: false,
      //修改用户数据
      changeForm: {},
      // 添加用户表单验证规则
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          { min: 3, max: 10, message: '请输入3到10个字符', trigger: 'blur' }
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          { min: 6, message: '密码必须大于6个字符', trigger: 'blur' }
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          { validator: validateEmail, trigger: 'blur' }
        ],
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          { validator: validateMobile, trigger: 'blur' }
        ]
      },
      // 分配角色弹窗是否显示
      allotShow: false,
      // 需要分配角色的用户信息
      userInfo: {},
      // 被选中的option  value(id)
      selValue: '',
      // 所有角色信息
      jsList: []
    }
  },
  created(){
    this.getUsersInfo()
  },
  methods: {
    /**
     * 获取、更新用户数据
     */
    getUsersInfo(){
      getUsers(this.queryInfo).then((res) => {
        // console.log(res)
        if(res.data.meta.status == 200){
          //获取成功了
          this.userList = res.data.data.users
          this.total = res.data.data.total
        }
      }).catch((err) => {
        // console.log(err)
      })
    },

    /**
     * 更改用户状态
     */
    changeUserState(userInfo){
      // console.log(userInfo)
      changeState(userInfo.id,userInfo.mg_state).then((res) => {
        if(res.data.meta.status !== 200){
          this.$message.error('更改失败，请稍后重试')
          userInfo.mg_state = !userInfo.mg_state
          return
        }
        this.$message.success('更改成功')
      })
    },

    /**
     * 分页处理
     */
    // 监听 每页条数 pagesize 变化
    handleSizeChange(value){
      // console.log(value)
      this.queryInfo.pagesize = value
      this.getUsersInfo()
    },
    //监听 当前页 pagenum 发生改变
    handleCurrentChange(value){
      // console.log(value)
      this.queryInfo.pagenum = value
      this.getUsersInfo()
    },

    /**
     * 添加用户模块
     */
    // 点击添加用户 / 显示用户对话框
    addUser(){
      this.addUserShow = true
    },
    //添加用户对话框关闭
    addClose(){
      this.$refs.addForm.resetFields()
      this.addUserShow = false
    },
    /**
     * 添加用户请求模块
     */
    addClick(){
      // 进行表单验证
      this.$refs.addForm.validate((reg) => {
        if(reg){
          // 验证成功发（请求）
          addUserInfo(this.addForm).then((res) => {
            // console.log(res)
            if(res.data.meta.status === 201){
              this.addUserShow = false
              this.$message.success('添加成功')
              this.getUsersInfo()
              return
            }
            this.$message.error('添加失败，请稍后重试')
          })
        }
      })
    },

    /**
     * 修改用户信息模块
     */
    // 修改用户对话框关闭
    changeClose(){
      this.$refs.changeForm.resetFields()
      this.changeUserShow = false
    },
    //点击修改用户信息  显示修改用户对话框
    changeUserInfo(info){
      this.changeUserShow = true
      // console.log(info)
      this.changeForm = info
      //根据id查询用户信息（请求）
      queryIdUser(this.changeForm.id).then((res) => {
        // console.log(res)
        if(res.data.meta.status !== 200){
          this.$message.error('查询失败，请稍后再试')
          return
        }
          this.changeForm.username = res.data.data.username
          this.changeForm.mobile = res.data.data.mobile
          this.changeForm.email = res.data.data.email
      })
    },
    /**
     * 修改用户请求模块
     */
    changeClick(){
      // 表单验证
      this.$refs.changeForm.validate((reg) => {
        // 验证成功
        if(reg){
          /**
           * 修改请求
           */
          changeUser(this.changeForm.id, this.changeForm.email, this.changeForm.mobile).then((res) => {
            // console.log(res)
            if(res.data.meta.status === 200){
              this.changeUserShow = false
              this.$message.success('修改成功')
              this.getUsersInfo()
              return 
            }
            this.$message.error('修改失败，请稍后重试')
          })
        }
      })
    },

    /**
     * 删除用户模块
     */
    // 删除用户
    delClick(userInfo){
      // console.log(userInfo)
      // 确认删除吗消息框？
      this.$confirm('您确定要永久删除用户吗？', '永久删除' ,{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        /**
         * 删除请求模块
         */
        delUsers(userInfo.id).then((res) => {
          if(res.data.meta.status === 200){
            this.$message.success('删除成功')
            this.getUsersInfo()
            return 
          }
          this.$message.success('删除失败，请稍后重试')
        })
      }).catch(() => {
        this.$message('已取消')
      })
    },

    /**
     * 分配角色
     */
    // 点击分配角色弹出框
    allotClick(userInfo){
      this.userInfo = userInfo
      allotJsList().then(res => {
        // console.log(res)
        if(res.data.meta.status !== 200){
          this.$message.error('获取失败')
          return
        }
        this.jsList = res.data.data
      })
      this.allotShow = true
    },
    // 确定分配角色
    yesAllotClick(){
      if(!this.selValue){
        this.$message.error('请选择角色')
        return
      }
      /* 分配用户角色请求 */
      allotJs(this.userInfo.id,this.selValue).then(res => {
        if(res.data.meta.status !== 200){
          this.$message.error('分配失败')
          return
        }
        this.$message.success('分配成功')
        this.getUsersInfo()
        this.allotShow = false
      })
    },
    allotClose(){
      this.selValue = ''
    }
  }
}
</script>

<style lang="less" scoped>
  .user-table{
    margin-top: 20px;
    font-size: 12px;
  }
  .el-pagination{
    margin-top: 20px;
  }
  .text{
    padding:5px 0;
  }
  .text-sel{
    padding-top: 10px;
  }
</style>