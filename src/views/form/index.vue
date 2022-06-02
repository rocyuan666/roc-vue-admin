<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="活动名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="活动区域">
        <el-select v-model="form.region" placeholder="请选择您的区域">
          <el-option label="区域1" value="shanghai" />
          <el-option label="区域2" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="活动时间">
        <el-col :span="11">
          <el-date-picker v-model="form.date1" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-col>
        <el-col :span="2" class="line">-</el-col>
        <el-col :span="11">
          <el-time-picker v-model="form.date2" type="fixed-time" placeholder="选择时间" style="width: 100%;" />
        </el-col>
      </el-form-item>
      <el-form-item label="即时交付">
        <el-switch v-model="form.delivery" />
      </el-form-item>
      <el-form-item label="活动类型">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="在线活动" name="type" />
          <el-checkbox label="促销活动" name="type" />
          <el-checkbox label="脱机活动" name="type" />
          <el-checkbox label="简单的品牌" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="资源">
        <el-radio-group v-model="form.resource">
          <el-radio label="赞助商" />
          <el-radio label="地点" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动表单">
        <el-input v-model="form.desc" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

