import { request } from './request'

// 商品分类数据列表
export function goodsListData(config){
  return request({
    url: '/categories',
    params: config
  })
}

// 添加分类请求
export function addClassData(addFormData){
  return request({
    url: '/categories',
    method: 'post',
    data: addFormData
  })
}

//修改分类名称
export function changeClassData(id, cat_name){
  return request({
    url: '/categories/' + id,
    method: 'put',
    data: {
      cat_name
    }
  })
}

//删除分类
export function deleteClassData(id){
  return request({
    url: '/categories/' + id,
    method: 'delete'
  })
}

// 获取所有的商品分类列表
export function getCateListData(){
  return request({
    url: '/categories',
    method: 'get'
  })
}

// 获取参数的列表数据  |  根据所选分类的Id,和当前面板的参数, 获取对应的参数
export function getParamsData(getCateId, activeTabsName){
  return request({
    url: '/categories/' + getCateId + '/attributes',
    method: 'get',
    params: {
      sel: activeTabsName
    }
  })
}
//添加参数
export function addParamsData(getCateId, attr_name, attr_sel){
  return request({
    url: '/categories/' + getCateId + '/attributes',
    method: 'post',
    data: {
      attr_name,
      attr_sel
    }
  })
}

// 展示编辑参数
export function showDitParamsData(getCateId, attrId, activeTabsName){
  return request({
    url: '/categories/' + getCateId + '/attributes/' + attrId,
    method: 'get',
    params: {
      attr_sel: activeTabsName
    }
  })
}

// 编辑参数
export function ditParamsData(getCateId, attrId, attr_name, activeTabsName){
  return request({
    url: '/categories/' + getCateId + '/attributes/' + attrId,
    method: 'put',
    data: {
      attr_name: attr_name,
      attr_sel: activeTabsName
    }
  })
}

// 删除参数项目
export function removeParamsData(getCateId, attrId){
  return request({
    url: '/categories/' + getCateId + '/attributes/' + attrId,
    method: 'delete',
  })
}

//添加参数Tag
export function addTagData(getCateId, attr_id, attr_name, attr_sel, attr_vals){
  return request({
    url: '/categories/'+ getCateId +'/attributes/' + attr_id,
    method: 'put',
    data: {
      attr_name,
      attr_sel,
      attr_vals: attr_vals.join(' ')
    }
  })
}

//获取商品列表
export function getGoodsListData(params){
  return request({
    url: '/goods',
    method: 'get',
    params
  })
}

// 删除商品信息
export function removeGoodsListData(id){
  return request({
    url: '/goods/' + id,
    method: 'delete'
  })
}

// 添加商品
export function addGoodData(form){
  return request({
    url: '/goods',
    method: 'post',
    data: form
  })
}

// 修改商品
export function editGoodData(id, data){
  return request({
    url: '/goods/' + id,
    method: 'put',
    data
  })
}
// 修改商品所需数据
export class editGoodObj{
  constructor(goods){
    this.goods_name = goods.goods_name
    this.goods_price = goods.goods_price
    this.goods_number = goods.goods_number
    this.goods_weight = goods.goods_weight
  }
} 
