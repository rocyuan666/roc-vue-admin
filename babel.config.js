//发布 阶段需要用到的 babel 插件
const prodPlugins = []
if(process.env.NODE_ENV === 'production') {
  //发布阶段：production   开发阶段：develop
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    // 开发、发布都会取消console
    // "transform-remove-console"
    ...prodPlugins
  ]
}
