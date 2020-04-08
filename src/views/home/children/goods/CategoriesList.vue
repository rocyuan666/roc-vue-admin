<template>
  <div>
    <!-- 导航 -->
    <mbx-nav one-nav="商品管理" two-nav="商品分类"></mbx-nav>
    <!-- 卡片试图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addClassClick">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 树状表格 -->
      <el-table
        :data="goodsList"
        border
        row-key="cat_id"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <!-- 是否有效展示 -->
        <el-table-column label="是否有效">
          <template v-slot="scope">
            <i class="el-icon-success" style="color:#67c23a;" v-if="scope.row.cat_deleted == false"></i>
            <i class="el-icon-error" style="color:#f56c6c;" v-else></i>
          </template>
        </el-table-column>
        <!-- 排序展示 -->
        <el-table-column label="排序">
          <template v-slot="scope">
            <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
            <el-tag v-else-if="scope.row.cat_level == 1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="180">
          <template v-slot="scope">
            <!-- {{scope.row}} -->
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="changeClassClick(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteClassClick(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="pagesizeFn"
        @current-change="pagenumFn"
        :current-page="reqParams.pagenum"
        :page-sizes="[5, 10]"
        :page-size="reqParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类 弹窗 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addClassShow"
      width="50%"
      @close="addClassClose">
      <el-form :model="addFormData" :rules="rules" ref="ruleForm" label-width="80px">
        <el-form-item class="cat-name" label="活动名称" prop="cat_name">
          <el-input v-model="addFormData.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
          ref="addCascader"
          v-model="idList"
          :options="options"
          :props="optionsSel"
          clearable
          @change="optChange">
        </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addClassShow = false">取 消</el-button>
        <el-button type="primary" @click="addClick">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑弹窗 -->
    <el-dialog
      title="修改名称"
      :visible.sync="changePopShow"
      @close='changeClose'
      width="50%">
       <el-form :model="changeFormData" :rules="changeRules" ref="changeForm" label-width="80px">
        <el-form-item label="修改名称" prop="cat_name">
          <el-input v-model="changeFormData.cat_name"></el-input>
        </el-form-item>
       </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changePopShow = false">取 消</el-button>
        <el-button type="primary" @click="changeYes">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mbxNav from 'components/MbxNav'

import { 
  goodsListData,
  addClassData,
  changeClassData,
  deleteClassData
 } from 'network/goods'

export default {
  name: 'CategoriesList',
  components:{
    mbxNav
  },
  data(){
    return {
      // 商品数据
      goodsList: [],
      // 请求参数
      reqParams: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品总数
      total: 0,
      //添加分类弹窗是否显示
      addClassShow: false,
      // 添加分类 表单验证规则
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 选中的父级分类id数组（选择多级多个id）
      idList: [],
      // 级联选择器中的数据源（请求保存）
      options:[],
      // props设置 select选择器
      optionsSel: {
        checkStrictly: true,
        expandTrigger: 'hover',
        value: 'cat_id',//选中的项
        label: 'cat_name',//展示的项
        children:'children'//二级项
      },
      // 添加分类（表单数据） 请求传值
      addFormData: {
        cat_name: '', // 分类的名称
        cat_pid: 0, // 父级分类i1
        cat_level: 0  // 分类的层级,默认0 一级
      },
      // 编辑弹窗显示
      changePopShow: false,
      // 修改名称 表单验证规则
      changeRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      //修改请求需要发的数据
      changeFormData: {
        cat_id: 0,
        cat_name: ''
      }
    }
  },
  created(){
    this.getGoodsList()
  },
  methods: {
    /**
     * 商品数据请求
     */
    getGoodsList(){
      goodsListData(this.reqParams).then(res => {
        if(res.data.meta.status !== 200){
          this.$message.error('获取失败')
          return
        }
        this.goodsList = res.data.data.result
        this.total = res.data.data.total
        // console.log(res)
      })
    },
    /**
     * 分页
     */
    pagesizeFn(size){
      this.reqParams.pagesize = size
      this.getGoodsList()
    },
    pagenumFn(num){
      this.reqParams.pagenum = num
      this.getGoodsList()
    },
    /**
     * 添加分类
     * 
     */
    addClassClick(){
      /* 获取父级分类数据请求（级联选择器） */
      goodsListData({type: 2}).then(res => {
        if(res.data.meta.status !== 200){
          this.$message.error('获取失败')
          return
        }
        // 保存级联数据
        this.options = res.data.data
      })
      this.addClassShow = true
    },
    //选项改变了
    optChange(){
      // this.idList.length大于0 选中了父级分类
      if(this.idList.length > 0){
        this.addFormData.cat_pid = this.idList[this.idList.length-1]
        this.addFormData.cat_level = this.idList.length
      }else{
        //反之则没有选中父级分类
        this.addFormData.cat_pid = 0
        this.addFormData.cat_level = 0
      }
    },
    //确定添加
    addClick(){
      this.$refs.ruleForm.validate(status => {
        if(status){
          // 确定添加请求
          addClassData(this.addFormData).then(res => {
            if(res.data.meta.status !== 201){
              this.$message.error('添加失败')
              return
            }
            console.log(res)
            this.$message.success('添加成功')
            this.getGoodsList()
            this.addClassShow = false
          })
          return
        }
      })
    },
    //添加分类弹窗关闭
    addClassClose(){
      this.$refs.ruleForm.resetFields()
      this.idList = []
      this.addFormData.cat_pid = 0
      this.addFormData.cat_level = 0
    },

    /**
     * 修改分类
     * 
     */
    //点击编辑
    changeClassClick(ClassInfo){
      // 保存当前所要修改名称 的item数据
      this.changeFormData.cat_id = ClassInfo.cat_id
      this.changeFormData.cat_name = ClassInfo.cat_name
      this.changePopShow = true
    },
    // 点击确定修改
    changeYes(){
      this.$refs.changeForm.validate(status => {
        if(status){
          /* 修改请求 */
          changeClassData(this.changeFormData.cat_id, this.changeFormData.cat_name).then(res => {
            if(res.data.meta.status !==200){
              this.$message.error('修改失败')
              return
            }
              this.$message.success('修改成功')
              this.getGoodsList()
              this.changePopShow = false
          })
        }
      })
    },
    //监听修改弹窗关闭
    changeClose(){
      this.$refs.changeForm.resetFields()
    },

    /**
     * 删除分类
     * 
     */
    deleteClassClick(classInfo){
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteClassData(classInfo.cat_id).then(res => {
          if(res.data.meta.status !== 200){
            this.$message.error('删除出错')
            return
          }
            this.$message.success('删除成功')
            this.getGoodsList()
        })
        console.log('确认')

      }).catch(() => {
        this.$message('已取消')
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .el-table{
    margin-top: 20px;
  }
  .el-pagination{
    margin-top: 20px;
  }
  .el-cascader{
    width: 100%;
  }
  .el-form-item{
    margin-bottom: 0;
  }
  .cat-name{
    margin-bottom: 20px;
  }
</style>