import { request } from './request'

//权限列表数据
export function getRightsList(type){
  return request({
    url: '/rights/' + type
  })
}

//角色列表数据
export function getRolesList(){
  return request({
    url: '/roles'
  })
}

//删除角色指定权限
export function delqx(jsid,qxid){
  return request({
    url: '/roles/'+ jsid + '/rights/' + qxid,
    method: 'delete'
  })
}

// 角色授权
export function addqx(roleId, rids){
  return request({
    url: '/roles/' + roleId + '/rights',
    method: 'post',
    data: {
      rids
    }
  })
}

//添加角色
export function addRolesData(data){
  return request({
    url: '/roles',
    method: 'post',
    data
  })
}

//编辑角色
export function editRolesData(id, data){
  return request({
    url: '/roles/' + id,
    method: 'put',
    data
  })
}
//删除角色
export function deleteRoleData(id){
  return request({
    url: '/roles/' + id,
    method: 'delete'
  })
}
