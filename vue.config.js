module.exports = {
  // 在vue-cli.3.3版本后  baseUrl被废除了，因此这边要写成 publicPath
  // baseUrl: './'     发布模式下 './'
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  //路径别名
  configureWebpack: {
    resolve: {
      alias: {
        'assets': '@/assets',
        'network': '@/network',
        'views': '@/views',
        'components': '@/components',
        'plugins': '@/plugins',
        'common': '@/common'
      }
    }
  },
  // 项目入口
  chainWebpack: config => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      //修改发布模式入口文件
      config.entry('app').clear().add('./src/main-prod.js')

      // externals设置  使用cdn加载，不会被打包（依赖cdn）
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })

      //首页index.html渲染定制(返回是否是发布模式)
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })

    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      //修改开发模式入口文件
      config.entry('app').clear().add('./src/main-dev.js')
      
      //首页index.html渲染定制(返回是否是发布模式)
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })


  }
}