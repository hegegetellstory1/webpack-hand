const path= require('path')
// 启用热更新的第1步
var webpack = require('webpack');
// 清除dist文件夹
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
// vue 加载项
const vueLoaderPlugin = require('vue-loader/lib/plugin')
// 为html文件中引入的外部资源如script、link动态添加每次compile后的hash，防止引用缓存的外部文件问题
// 可以生成创建html入口文件，配置N个html-webpack-plugin可以生成N个页面入口
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 如果在JS中导入了css，那么就需要使用 css-loader 来识别这个模块，通过特定的语法规则进行转换内容最后导出
// css-loader会处理 import / require（） @import / url 引入的内容。
// sass-loader把scss转成css
// less-loader把less转成css
// style-loader把css转换成脚本加载的JavaScript代码  几者配合使用

module.exports= {
  mode:'development',//默认开发模式
  entry:{
    app:path.resolve(__dirname,'../src/main.js')  //配置入口
  },
  output:{
    filename:'[name].[hash:8].js', // 打包后的文件名称
    path:path.resolve(__dirname, '../dist') //打包的目录
  },
  // module 配置 loader
  module:{
    rules:[{
    test:/\.vue$/,
    use:['vue-loader']
},
// 编译css
{
  test:/\.css$/,
  use: ['vue-style-loader','css-loader',{
    loader:'postcss-loader',
    options:{
      plugins:[require('autoprefixer')]
    }
  }] // 从右向左解析
},
// 编译less
{
  test:/\.less$/,
  use: ['vue-style-loader','css-loader',{
    loader:'postcss-loader',
    options:{
      plugins:[require('autoprefixer')]
    }
  },'less-loader'] //// 从右向左解析
},
//file-loader vs url-loader
// 二者一般只选择一个来进行对文件的打包，防止有冲突出现导致图片加载失败
// 但是 可以在url-loader的fallback属性指定不满足条件时的 loader
// url-loader 依赖于 file-loader，如果不安装 file-loader，会报错误
// url-loader会通过配置规则将一定范围大小的图片打包成base64的字符串，
// 放到dist.js文件里，而不是单独生成一个图片文件。而file-loader在打包时一定会生成单独的图片文件。
{
  test: /\.(jpe?g|png|gif)$/i, //图片文件
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 10*1024,
        fallback: {
          loader: 'file-loader',
          options: {
              name: 'images/[name].[hash:8].[ext]'
          }
        }
      }
    }
  ]
},
{
  test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i, // 字体文件
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 49460,
        fallback: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[hash:8].[ext]'
          }
        }
      }
    },
  ]},
{
  test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, //媒体文件
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 49460,
        fallback: {
          loader: 'file-loader',
          options: {
            name: 'medias/[name].[hash:8].[ext]'
          }
        }
      }
    }
  ]
},
// babel-loader是webpack 与 babel的通信桥梁，
// 不会做把es6转成 es5的⼯作，这部分工作需要⽤用到@babel/preset-env来做 ,
// babel/core babel的核心库，提供了很多核心语法
{
  test:/\.js$/,
  use:{
    loader:'babel-loader',
    options:{
      presets:[
        ['@babel/preset-env']
      ]
    }
  }
},

]
},
resolve:{
  // 在组件之间相互引用时我们可以省略后缀    
  //类似import Hello from '../src.components/Hello' 是可以被识别的;
  extensions:['*','.js','.json','.vue'],
  // 配置 别名使用 我们就可以省略 多级目录 比如上面的加入这个配置就可以
  //  写成import Hello from '@components/Hello';

  alias:{
    'vue$':'vue/dist/vue.runtime.esm.js',
    '@':path.resolve(__dirname,'../src'),
    //我们自定义一个别名  通过@img 代替../src/assets/images
    //'@img':path.resolve(__dirname,'../src/assets/images'),

  },
},
// 启用热更新的第二步
devServer: {
  // 这是配置 dev-server 
  open: true, // 自动打开浏览器
  port: 3000, // 设置启动时候的运行端口
  contentBase:path.join(__dirname,'../dist'),//静态文件路径
  hot: true // 启动热更新的第一步
},
// 配置插件
plugins:[    
  // vue加载程序在没有相应插件的情况下使用。确保在Web包配置中包含VueLoaderPlugin。
  new vueLoaderPlugin(),
  // 另外的配置大家可以看官方文档
  new HtmlWebpackPlugin({
    template:path.resolve(__dirname,'../public/index.html'), //html模板所在的文件路径
    filename:'index.html' //输出的html的文件名称
//  inject
// 注入选项。有四个选项值 true, body, head, false.

// true：默认值，script标签位于html文件的 body 底部
// body：script标签位于html文件的 body 底部（同 true）
// head：script 标签位于 head 标签内
// false：不插入生成的 js 文件，只是单纯的生成一个 html 文件


  }),
  // new 一个热更新的模块对象，这是启用热更新的第三步
 new webpack.HotModuleReplacementPlugin(),
//  清除dist文件
 new CleanWebpackPlugin()
]
}