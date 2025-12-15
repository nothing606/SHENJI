// vue.config.js
const path = require('path');

module.exports = {
  // 配置webpack
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  },
  
  // 多平台配置
  pluginOptions: {
    'weapp': {
      // 小程序相关配置
      appid: 'your-appid',
      minified: true,
    },
    'h5': {
      // H5相关配置
      publicPath: process.env.NODE_ENV === 'production' ? '/your-base-url/' : '/',
    },
  },
  
  // 生产环境source map
  productionSourceMap: false,
  
  // 开发服务器配置
  devServer: {
    proxy: {
      '/api': {
        target: 'http://your-api-server',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
};