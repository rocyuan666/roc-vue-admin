<template>
    <div class="login-page">
        <div class="login-box">
            <div class="icon-tx">
                <img src="~assets/img/logo.jpg" alt="">
            </div>
            <!-- 
              1.绑定表单验证规则  el-form :rules="rules

              3.给el-form-item 指定prop属性="name" 按照定义的name规则进行验证

              使用name规则验证 prop="name" 下的表单
             -->
            <el-form ref="loginForm" :model="form" class="form-box" :rules="rules">
                <el-form-item prop="name">
                    <el-input v-model="form.name" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="form.password" @keyup.enter.native='loginClick' type="password" prefix-icon="el-icon-unlock"></el-input>
                </el-form-item>
                <el-form-item class="button-box">
                  <el-button type="primary" @click='loginClick'>登录</el-button>
                  <el-button type="info" @click="reseClick">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { getlogin } from 'network/login'

export default {
    name: 'Login',
    data() {
      return {
        form: {
            name: '',
            password: ''
        },
        rules: {
          // 2.定义表单验证规则
          name: [
            // 必填，提示，失去焦点
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ]
        }
      }
    },
    created(){
      window.sessionStorage.removeItem('token')
      window.sessionStorage.removeItem('activePath')
    },
    methods: {
      // 登录成功提示
      loginSuccess(){
        this.$message({
          message: '恭喜您，登录成功！',
          type: 'success'
        });
      },
      // 登录失败提示
      loginError(){
        this.$message({
          message: '登录失败，请检查您的用户名及密码！',
          type: 'error'
        });
      },
      loginClick(){
        // 对整个表单进行校验，两个参数：是否校验成功 未通过校验的字段
        this.$refs.loginForm.validate((valid) => {
          // 验证通过 发送请求
          if(valid){
            getlogin(this.form.name,this.form.password).then((res) => {
              // console.log(res)
              if(res.data.meta.status == 200){
                // 登录成功
                this.loginSuccess()
                // 保存 token 到 sessionStorage（关闭浏览器删除） 中
                window.sessionStorage.setItem('token',res.data.data.token)
                //转跳到主页
                this.$router.push('/home');
              }else{
                // 登录失败
                this.loginError()
              }
            }).catch((err) => {
              
            })
          }
        })
        
        
      },
      reseClick(){
        // 对表单进行重置 resetFields()
        this.$refs.loginForm.resetFields()
      }
    }
}
</script>

<style lang="less" scoped>
    .login-page{
        height: 100%;
        background-color: #2474b5;
    }
    .login-box{
        width: 600px;
        height: 380px;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 0 4px rgba(0, 0, 0, .3);
        position: absolute;
        left:50%;
        top:50%;
        transform: translate(-50%,-50%)
    }
    .icon-tx{
        width: 200px;
        height: 200px;
        border-radius: 50%;
        overflow: hidden;
        padding:10px;
        background-color: #fff;
        box-shadow: 0 0 6px #ddd;
        box-sizing: border-box;
        position: absolute;
        left:50%;
        top:-100px;
        transform: translate(-50%, 0)
    }
    .icon-tx img{
        width: 100%;
        border-radius: 50%;
        box-shadow: 0 0 6px #ddd;
    }
    .form-box{
      width: 400px;
      margin:0 auto;
      padding-top: 130px;
    }
    .button-box{
      display: flex;
      justify-content: flex-end;
    }
</style>