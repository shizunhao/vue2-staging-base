const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    open: true, // 是否自动弹出浏览器页面
    host: '0.0.0.0',
    port: '8082',
    https: false,
    // hotOnly: false,
    proxy: {
      '/oauth': {
        target: 'http://10.1.8.109:10380', // API服务器的地址
        // target: 'http://10.1.8.109:10380', // API服务器的地址
        ws: true, // 代理websockets
        changeOrigin: true, // 虚拟的站点需要更管origin
        pathRewrite: { // 重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
          '^/login': ''
        }
      },

      '/hr/core': {
        target: 'http://10.1.9.45:7211',
        // target: 'http://10.12.28.61:7111',
        // target: 'http://10.12.28.221:7111', // API服务器的地址
        // target: 'http://10.12.29.19:7111', // API服务器的地址
        ws: true, // 代理websockets
        changeOrigin: true, // 虚拟的站点需要更管origin
        pathRewrite: { // 重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
          '^/api': ''
        }
      },

    }
  },
  transpileDependencies: true
})
