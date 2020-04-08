import Vue from 'vue'
import VueRouter from 'vue-router'

/**
 * 重写路由的push方法、replace方法,防止报错
 */
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err);
};

const Login = () => import('views/login/Login')
const Home = () => import('views/home/Home')

const Welcome = () => import('views/home/children/Welcome')
const UserList = () => import('views/home/children/users/UserList')
const RolesList = () => import('views/home/children/roles/RolesList')
const RightsList = () => import('views/home/children/roles/RightsList')
const GoodsList = () => import('views/home/children/goods/GoodsList')
const Params = () => import('views/home/children/goods/Params')
const Add = () => import('views/home/children/goods/Add')
const CategoriesList = () => import('views/home/children/goods/CategoriesList')
const OrdersList = () => import('views/home/children/orders/OrdersList')
const Reports = () => import('views/home/children/reports/Reports')



Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: UserList
      },
      {
        path: '/roles',
        component: RolesList
      },
      {
        path: '/rights',
        component: RightsList
      },
      {
        path: '/goods',
        component: GoodsList,
      },
      {
        path: '/goods/add',
        component: Add,
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/categories',
        component: CategoriesList
      },
      {
        path: '/orders',
        component: OrdersList
      },
      {
        path: '/reports',
        component: Reports
      }
    ]
  }
]
const router = new VueRouter({
    routes
})

// 是否已经登录  导航守卫
router.beforeEach((to, from, next) => {
  if(to.path === '/login'){
    return next()
  }
  // 获取到token (有无token判断，是否登录)
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr){
    return next('/login')
  }else{
    return next()
  }
})

export default router
