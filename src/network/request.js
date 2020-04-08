import axios from 'axios'
import NProgress from 'nprogress'

export function request(config){
  // 创建实例
  const sl1 = axios.create({
    // baseURL: 'http://127.0.0.1:8888/api/private/v1',
    baseURL: 'http://www.luojing.top:8080/api/private/v1',
    // baseURL: 'http://192.168.1.103:8888/api/private/v1',
    timeout: 5000
  })

  //请求拦截
  //除了登录api  其他api需要授权，授权认证:必需在请求头设置 Authorization: token 
  sl1.interceptors.request.use(
    (config) => {
      //展示进度条
      NProgress.start()
      // console.log(config)
      // 处理请求的config
      config.headers.Authorization = window.sessionStorage.getItem('token');
      return config
    }
  )

  sl1.interceptors.response.use((res) => {
    //隐藏
    NProgress.done()
    return res
  })

  // 发送请求
  return sl1(config)
}