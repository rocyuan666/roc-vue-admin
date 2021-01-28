# 电商后台管理系统(前端Vue项目）

> 介绍：本项目是基于Vue技术栈+ElementUI的SPA项目

> 个人网站：[https://www.luojing.top](https://luojing.top) 或 百度一下 [rocyuan](https://www.baidu.com/s?ie=UTF-8&wd=rocyuan)

> 项目地址：[http://roc.luojing.top/vueadmin](http://roc.luojing.top/vueadmin)

> username: ` admin ` password: ` 123456 `
## 功能

- 登录
- 注销
- 用户管理
  - 用户列表
- 用户管理
  - 角色列表
  - 权限列表
- 商品管理
  - 商品列表
  - 分类参数
  - 商品分类
- 订单管理
  - 订单列表
- 数据统计
  - 数据报表

## 技术栈

- Vue
- Vue-router
- axios (进行了封装，降低axios与项目的耦合度)
- ElementUI
- Echarts

## 关于接口数据

> 本人提供的接口地址（baseURL）：` http://roc.luojing.top:8888/api/private/v1 `注意！！！大家别乱删数据，删了请添加回去；如出现被删除导致数据库删空，请联系本人：` yuanpeng0704@gmail.com ` 、` rocyuan@luojing.top `，我将抽空重新恢复导入数据库数据

> 接口源码下载（直接用我的接口地址，不用下载）：[点击下载](http://luojing.top/api_serve.zip)

### 源码说明（直接用我的接口，下面可略过）： 

> 安装 ` node ` 

> 将 ` db ` 文件夹下的 ` mydb.sql ` 导入数据库

> ` config > default.json ` 修改连接数据库账号密码等配置

> ` node app.js ` 跑起来

### 接口文档

[接口文档](api.md)

## 项目结构

```
.
├── src                                         // 源码目录
│   ├── assets                                  // 静态资源
│   │   ├── css                                 // css文件
│   │   └── img                                 // 图片文件
│   ├── common                                  // 公共js文件（工具，等）
│   ├── components                              // 组件
│   │   └── MbxNav.vue                          // 公共面包屑导航
│   ├── network                                 // 数据请求
│   │   ├── request.js                          // axios配置，以及封装axios
│   │   ├── goods.js                            // 商品管理 请求业务
│   │   ├── home.js                             // 用户列表 主页请求业务
│   │   ├── login.js                            // 登录页面 请求业务
│   │   ├── orders.js                           // 订单管理 请求业务
│   │   ├── reports.js                          // 数据统计 请求业务
│   │   └── rights.js                           // 权限管理 请求业务
│   ├── plugins                                 // 插件目录（elementUI.js）
│   ├── router                                  // 路由目录
│   │   └── index.js                            // 路由配置
│   ├── views                                   // 主要页面目录
│   │   ├── home                                // 首页目录
│   │   │   ├── Home.vue                        // 首页
│   │   │   ├── children                        // 子页面目录
│   │   │   │   ├── Welcome.vue                 // 欢迎页面
│   │   │   │   ├── users                       // 用户管理目录
│   │   │   │   │   └── UserList.vue            // 用户列表页
│   │   │   │   ├── roles                       // 权限管理目录
│   │   │   │   │   ├── RolesList.vue           // 角色列表页
│   │   │   │   │   └── RightsList.vue          // 权限列表页
│   │   │   │   ├── goods                       // 商品管理目录
│   │   │   │   │   ├── GoodsList.vue           // 商品列表页
│   │   │   │   │   ├── Add.vue                 // 添加商品页
│   │   │   │   │   ├── Params.vue              // 分类参数页
│   │   │   │   │   └── CategoriesList.vue      // 商品分类页
│   │   │   │   ├── orders                      // 订单管理目录
│   │   │   │   │   └── OrdersList.vue          // 订单列表页
│   │   │   │   ├── reports                     // 数据统计目录
│   │   │   │   │   └── Reports.vue             // 数据报表页
│   │   ├── login                               // 登录目录
│   │   │   └── Login.vue                       // 登录页

```


## 项目优化 (具体优化方法见个人网站) [RocYuan](http://www.luojing.top/rocyuan)

` 个人不喜欢在github写一些 心得记录 有时间的话基本都写在个人网站 `

- 顶部进度条（nprogress）

- 去掉console（babel-plugin-transform-remove-console）

- 开发模式，发布模式入口调整（chainWebpack）

- 发布模式使用cdn资源（externals）

- 定制index.html页面


## 应用部分截图

<img src="http://luojing.top/adminimg/1-1.jpg" />

<img src="http://luojing.top/adminimg/1-2.jpg" />

<img src="http://luojing.top/adminimg/2-1.jpg" />

<img src="http://luojing.top/adminimg/2-2.jpg" />

<img src="http://luojing.top/adminimg/4-1.jpg" />

<img src="http://luojing.top/adminimg/4-2.jpg" />

<img src="http://luojing.top/adminimg/5-1.jpg" />

<img src="http://luojing.top/adminimg/6-1.jpg" />

<img src="http://luojing.top/adminimg/7-1.jpg" />

