// copy-webpack-plugin 拷贝资源
// optimize-css-assets-webpack-plugin 压缩css
// uglifyjs-webpack-plugin 压缩js
// webpack mode设置production的时候会自动压缩js代码。
// 原则上不需要引入uglifyjs-webpack-plugin进行重复工作。
// 但是optimize-css-assets-webpack-plugin压缩css的同时会破坏原有的js压缩，
// 所以这里我们引入uglifyjs 或terser-webpack-plugin进行压缩 
const path = require('path')
const baseConfig = require('./webpack.base.config')
// 合并配置
const {merge} = require('webpack-merge')
// 拷贝资源
const CopyWebpackPlugin = require('copy-webpack-plugin')
// 压缩css
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// 压缩js
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// 开启gip
const CompressionWebpackPlugin = require('compression-webpack-plugin');
// 代码混淆压缩
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(baseConfig,{
  mode:'production',
  // 启动sourceMap
  //  1、source-map：产生文件，产生行列
  //   devtool: 'source-map',
  //   2、eval-source-map：不产生文件，产生行类
  //   devtool: 'eval-source-map',
  //   3、cheap-source-map：产生文件，不产生列
  //   devtool: 'cheap-module-source-map',
  //   4、cheap-module-eval-source-map：不产生文件，不产生列 生产不需要
  devtool:'cheap-module-source-map',
  plugins:[
    new CopyWebpackPlugin(
      
      // 下面这种写法报错
    //   [{
    //   from:path.resolve(__dirname,'../public'),
    //   to:path.resolve(__dirname,'../dist')
    // }]
    //正确写法
    {
      patterns: [
        {
          from:path.resolve(__dirname,'../public'),
            to:path.resolve(__dirname,'../dist')
          }
    ],
    }
    ),
    //打包的时候开启gzip可以大大减少体积，非常适合于上线部署
    new CompressionWebpackPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp('\\.(' + ['html', 'js', 'css'].join('|') + ')$'),
      threshold: 10240, // 只有大小大于该值的资源会被处理 10240
      minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
      deleteOriginalAssets: false // 删除原文件
  }),
  ],
  optimization:{
    minimizer:[
      
    //   new UglifyJsPlugin({//压缩js
    //     cache:true,
    //     parallel:true,
    //     sourceMap:true
    // }),
    //两个都是 js 压缩 两个选一个都行
    new TerserPlugin({
      terserOptions: {
          warnings: false,
          compress: {
              drop_console: true,
              pure_funcs: ['console.log'] //删除console.log
          }
      },
      sourceMap: false,
      parallel: true
  }),
    new OptimizeCssAssetsPlugin({}),
    
    
    ],
    splitChunks:{
      chunks:'all',
      cacheGroups:{
        vendors: {
          name: "common",
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: "initial" // 只打包初始时依赖的第三方
        }
      }

  }
}
})

