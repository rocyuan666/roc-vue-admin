<template>
  <div>
    <!-- 导航 -->
    <mbx-nav one-nav="商品管理" two-nav="分类参数"></mbx-nav>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab页签区域 -->
      <el-tabs v-model="activeTabsName" @tab-click="handleTabsClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            class="mb10"
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >{{item}}</el-tag>
                <!-- 输入Tag文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            class="mb10"
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
          >添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开列 -->
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >{{item}}</el-tag>
                <!-- 输入Tag文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      :title=" '添加' + getTitleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef" label-width="100px">
        <el-form-item :label="getTitleText" prop="attr_name">
          <el-input v-model="addFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数对话框 -->
    <el-dialog
      :title=" '修改' + getTitleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editFrom" :rules="editFromRules" ref="editFromRef" label-width="100px">
        <el-form-item :label="getTitleText" prop="attr_name">
          <el-input v-model="editFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mbxNav from 'components/MbxNav'
import {
  getCateListData,
  getParamsData,
  addParamsData,
  showDitParamsData,
  ditParamsData,
  removeParamsData,
  addTagData
} from 'network/goods'

export default {
  data () {
    return {
      // 商品分类列表
      cateList: [],
      //   级联选择框的配置对象
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //   级联选择框双向绑定对象
      selectedCateKeys: [],
      //   激活页签名称
      activeTabsName: 'many',
      //   动态参数数据
      manyTableData: [],
      //   静态属性数据
      onlyTableData: [],
      //   控制添加参数对话框的显示与隐藏
      addDialogVisible: false,
      //   添加表单的数据对象
      addFrom: {
        attr_name: ''
      },
      //   添加表单的验证规则
      addFromRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      //   编辑对话框
      editDialogVisible: false,
      //   修改表单数据对象
      editFrom: {},
      //   修改表单验证规则
      editFromRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    mbxNav
  },
  created () {
    this.getCateList()
  },
  computed: {
    //   按钮需要被禁用返回true, 否则返回false
    isBtnDisabled () {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类Id
    getCateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    getTitleText () {
      if (this.activeTabsName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  },
  methods: {
    //   获取所有的商品分类列表
    getCateList () {
      getCateListData().then(res => {
        // console.log(res)
        if (res.data.meta.status !== 200) {
          return this.$message.error('获取商品数据列表失败！')
        }
        this.cateList = res.data.data
      })
    },
    // 级联选择框 选中变化 触发
    handleChange () {
      this.getParams()
    },
    // Tab页签点击事件的处理函数
    handleTabsClick () {
      this.getParams()
    },
    // 获取参数的列表数据
    getParams () {
      // 只允许选择三级分类：
      // 通过数组的长度判断
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        // 清空表格数据
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      // 根据所选分类的Id,和当前面板的参数, 获取对应的参数
      getParamsData(this.getCateId, this.activeTabsName).then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('获取参数列表失败！')
        }
        // console.log(res.data.data)
        res.data.data.forEach(item => {
          // console.log(item.attr_vals)
          //   通过三元表达式判断attr_vals(板式tag)是否为空
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          // 控制文本框的显示与隐藏
          item.inputVisible = false
          // 文本框的输入值
          item.inputValue = ''
        })
        // 判断是静态属性还是动态属性
        if (this.activeTabsName === 'many') {
          this.manyTableData = res.data.data
        } else {
          this.onlyTableData = res.data.data
        }
      })
    },
    // 监听对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFromRef.resetFields()
    },
    /**
     * 添加参数
     */
    addParams () {
      this.$refs.addFromRef.validate(valid => {
        if (!valid) return
        //发送请求
        addParamsData(this.getCateId, this.addFrom.attr_name, this.activeTabsName).then(res => {
          if (res.data.meta.status !== 201) {
            return this.$message.error('添加参数失败！')
          }
          this.$message.success('添加参数成功！')
          this.addDialogVisible = false
          this.getParams()
        })
      })
    },
    // 显示编辑对话框
    showEditDialog (attrId) {
      // 展示编辑参数
      showDitParamsData(this.getCateId, attrId, this.activeTabsName).then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('获取分类失败！')
        }
        this.editFrom = res.data.data
        this.editDialogVisible = true
      })
    },
    // 重置修改表单
    editDialogClosed () {
      this.$refs.editFromRef.resetFields()
    },
    /**
     * 修改参数
     */
    editParams () {
      this.$refs.editFromRef.validate(valid => {
        if (!valid) return
        //修改请求
        ditParamsData(this.getCateId, this.editFrom.attr_id, this.editFrom.attr_name, this.activeTabsName).then(res => {
          if (res.data.meta.status !== 200) {
            return this.$message.error('修改参数失败！')
          }
          this.$message.success('修改参数成功！')
          this.getParams()
          this.editDialogVisible = false
        })
      })
    },
    /**
     * 根据Id删除对应的参数项
     */
    removeParams (attrId) {
      const confirmResult = this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        //删除请求
        removeParamsData(this.getCateId, attrId).then(res => {
          if (res.data.meta.status !== 200) {
            return this.$message.error('删除参数失败！')
          }
          this.$message.success('删除参数成功！')
          this.getParams()
        })
      }).catch(() => {
        this.$message.info('已取消删除！')
      })
    },
    /**
     * 添加tag
     */
    // 添加参数attr_vals（Tag）判断文本框失去焦点,或者按下Enter触发
    handleInputConfirm (row) {
      // 输入的内容为空时，清空
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 提交数据库，保存修改
      this.saveAttrVals(row)
    },
    // attr_vals（Tag） 添加 请求
    saveAttrVals (row) {
      // 发送请求
      addTagData(
        this.getCateId,
        row.attr_id,
        row.attr_name,
        row.attr_sel,
        row.attr_vals
      ).then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('修改参数项失败！')
        }
        this.$message.success('修改参数项成功！')
      })
    },
    // 点击按钮显示输入框
    showInput (row) {
      row.inputVisible = true
      //   让输入框自动获取焦点
      // $nextTick方法的作用：当页面元素被重新渲染之后，才会至指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除对应的参数（tag）可选项
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0px;
}
.el-cascader {
  width: 25%;
}
.el-tag {
  margin: 8px;
}
.input-new-tag {
  width: 90px;
}
.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.mb10{
  margin-bottom: 10px;
}
</style>
