import { request } from './request'

// 订单展示
export function getOrderListData(params){
  return request({
    url: '/orders',
    params
  })
}

//快递查询
export function getProgressData(kdid){
  return request({
    url: '/kuaidi/' + kdid
  })
}
