import { request } from './request'

//获取侧边栏数据
export function getMenus(){
  return request({
    url: '/menus'
  })
}

//获取用户列表数据
export function getUsers(queryInfo){
  return request({
    url: '/users',
    params: queryInfo
  })
}

//更改用户状态
export function changeState(uid,type){
  return request({
    url: '/users/'+ uid + '/state/' + type,
    method: 'put'
  })
}

//添加用户
export function addUserInfo(userInfo){
  return request({
    url: '/users',
    method: 'post',
    data: userInfo
  })
}

// 根据id查询用户信息
export function queryIdUser(id){
  return request({
    url: '/users/' + id
  })
}

// 修改用户信息
export function changeUser(id,email,mobile){
  return request({
    url: '/users/' + id,
    method: 'put',
    data: {
      email,
      mobile
    }
  })
}

//删除用户
export function delUsers(id){
  return request({
    url: '/users/' + id,
    method: 'delete'
  })
}

// 分配角色-角色列表
export function allotJsList(){
  return request({
    url: '/roles'
  })
}

// 分配用户角色
export function allotJs(id,rid){
  return request({
    url: '/users/' + id + '/role',
    method: 'put',
    data: {
      rid
    }
  })
}
