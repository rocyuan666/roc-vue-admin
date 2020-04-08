<template>
  <div>
    <!-- 导航 -->
    <mbx-nav one-nav="数据统计" two-nav="数据报表"></mbx-nav>
    <!-- 卡片视图 -->
    <el-card>
        <!-- 2.为Echarts准备一个Dom -->
        <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// 1.导入echarts
import echarts from 'echarts'
import _ from 'lodash'

import {
  getChartData
} from 'network/reports'

import mbxNav from 'components/MbxNav'

export default {
  data () {
    return {
      // 需要合并的数据
      options: {
        // 主标题文本
        title: {
          text: '用户来源'
        },
        // 提示框组件
        tooltip: {
          // 触发类型 坐标轴触发axis
          trigger: 'axis',
          // 坐标轴指示器配置项 
          axisPointer: {
            // 指示器类型 十字准星指示器 cross
            type: 'cross',
            // 指示器tag设置
            label: {
              backgroundColor: '#666',
              color:'#fff'
            }
          }
        },
        // 是否显示直角坐标系网格
        grid: {
          show: true,
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            // data x轴数据
            // x轴两边留白
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            // 坐标轴类型 数值轴 value
            type: 'value'
          }
        ]
      }
    }
  },
  components: {
    mbxNav
  },
  // 此时,页面上的元素,已经被渲染完毕了
  mounted () {
    // 3.基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById('main'))
    getChartData().then(res => {
      if (res.data.meta.status !== 200)
      return this.$message('获取折线图数据失败!')

      // 4.准备数据项和配置项
      // 数据合并
      // console.log(res.data.data)
      const result = _.merge(res.data.data, this.options)
      // console.log(result)
      // 5.展示数据
      myChart.setOption(result)
    })
  },
}
</script>

<style lang="less" scoped>

</style>
