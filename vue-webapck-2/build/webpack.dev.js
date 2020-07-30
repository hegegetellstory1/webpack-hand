const path= require('path')
// 启用热更新的第1步
let Webpack = require('webpack');
const baseConfig = require('./webpack.base.config')
// webpack-merge 合并配置
// 通过结构取其中的merge 函数
const {merge}  = require('webpack-merge')
module.exports = merge(baseConfig,{
  mode:'development',
  // 启动sourceMap
  //  1、source-map：产生文件，产生行列
  //   devtool: 'source-map',
  //   2、eval-source-map：不产生文件，产生行类
  //   devtool: 'eval-source-map',
  //   3、cheap-source-map：产生文件，不产生列
  //   devtool: 'cheap-module-source-map',
  //   4、cheap-module-eval-source-map：不产生文件，不产生列
  devtool:'cheap-module-eval-source-map',
 // 启用热更新的第二步
devServer: {
  // 这是配置 dev-server 
  open: true, // 自动打开浏览器
  port: 3000, // 设置启动时候的运行端口
  contentBase:path.join(__dirname,'../dist'),//静态文件路径
  hot: true // 启动热更新的第一步
},
  plugins:[
  // new 一个热更新的模块对象，这是启用热更新的第三步
  new Webpack.HotModuleReplacementPlugin()
  ]
})
