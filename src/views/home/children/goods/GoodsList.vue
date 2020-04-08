<template>
  <div>
    <!-- 导航 -->
    <mbx-nav one-nav="商品管理" two-nav="商品列表"></mbx-nav>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格数据 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="100px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="商品数量" prop="goods_number" width="70px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140px">
          <template slot-scope="scope">{{scope.row.add_time | dataFormat }}</template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button 
              type="primary" 
              icon="el-icon-edit" 
              size="mini"
              @click="editGood(scope.row)"
            ></el-button>

            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>

    <!-- 修改商品 弹窗 -->
    <el-dialog
      title="修改商品"
      :visible.sync="editGoodPop"
      width="50%">
      <el-form :model="editGoodInfo" :rules="editRules" ref="editForm" label-width="80px">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editGoodInfo.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="editGoodInfo.goods_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input v-model="editGoodInfo.goods_weight"  type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品数量">
          <el-input v-model="editGoodInfo.goods_number"  type="number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editGoodPop = false">取 消</el-button>
        <el-button type="primary" @click="editGoodPop = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mbxNav from 'components/MbxNav'

import {
  getGoodsListData,
  removeGoodsListData,
  editGoodData,
  editGoodObj
} from 'network/goods'
import { 
  formatDate
 } from 'common/tools'

export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表
      goodsList: [],
      // 商品总数
      total: 0,

      // 修改商品弹窗显示
      editGoodPop: false,
      //修改商品的信息
      editGoodId: 0,
      editGoodInfo:{},
      //修改商品表单验证
      editRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    mbxNav
  },
  created () {
    this.getGoodsList()
  },
  filters: {
    dataFormat(time){
      const date = new Date(Number(time)*1000)
      return formatDate(date,'yyyy/MM/dd hh:mm:sss')
    }
  },
  methods: {
    /**
     * 获取商品列表
     */
    // 根据分页获取对应的商品列表
    getGoodsList () {
      getGoodsListData(this.queryInfo).then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('获取商品列表失败！')
        }
        this.goodsList = res.data.data.goods
        //   console.log(this.goodsList)
        this.total = res.data.data.total
      })
    },
    //一页显示多少条改变
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    //当前页改变
    handleCurrentChange (newSize) {
      this.queryInfo.pagenum = newSize
      this.getGoodsList()
    },

    /**
     * 删除商品
     */
    // 通过Id删除商品
    removeById (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除请求
        removeGoodsListData(id).then(res => {
          console.log(res)
          if (res.data.meta.status !== 200) {
            return this.$message.error('删除商品失败！')
          }
          this.$message.success('删除商品成功！')
          this.getGoodsList()
        })
      }).catch(() => {
        this.$message('已取消删除！')
      })
    },
    goAddPage () {
      this.$router.push('/goods/add')
    },

    /**
     * 修改商品
     */
    //修改弹窗数据处理
    editGood(goodInfo){
      this.$message.error('暂不支持')
      // console.log(goodInfo)
      // this.editGoodId = goodInfo.goods_id
      // this.editGoodInfo = new editGoodObj(goodInfo)

      // this.editGoodPop = true
    },
    // 确定修改
    // editGoodClick(){
    //   this.$refs.editForm.validate(value => {
    //     if(!value){
    //       return 
    //     }
    //     //发送请求
    //     console.log(this.editGoodId)
    //     console.log(this.editGoodInfo)
    //     editGoodData(this.editGoodId, this.editGoodInfo).then(res => {
    //       console.log(res)
    //       if(res.data.meta.status !== 201){
    //         this.$message.error('修改失败')
    //         return
    //       }
    //       this.$message.error('修改成功')
    //       this.editGoodPop = false
    //       this.getGoodsList()
    //     })
    //   })
    // }
  }
}
</script>

<style lang="less" scoped>
  .el-table{
    margin: 20px 0;
  }
</style>
