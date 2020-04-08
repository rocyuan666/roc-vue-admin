import { request } from './request'

// 图表数据
export function getChartData(){
  return request({
    url: '/reports/type/1',
  })
}