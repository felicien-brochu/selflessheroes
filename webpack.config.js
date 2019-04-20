var webpack = require('webpack')
const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const VueLoader = require('vue-loader')

const env = process.env.NODE_ENV

const config = {
  entry: {
    app: [path.resolve(__dirname, 'src/main.js')],
    phaser: ['phaser']
  },
  // target: 'electron-renderer',
  mode: env,
  output: {
    publicPath: '/',
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
  },
  devtool: env === 'development' ? 'inline-source-map' : undefined,
  devServer: {
    contentBase: 'dist',
    port: 3000
  },
  module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.join(__dirname, 'src')],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
    ],
  },
  plugins: [
    new VueLoader.VueLoaderPlugin(),
    // new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: path.join(__dirname, 'dist', 'index.html'),
      template: path.join(__dirname, 'static', 'index.html'),
      inject: true
    }),
    new CopyWebpackPlugin([{
      from: 'static/assets',
      to: 'assets'
    }])
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
}

if (env === 'production') {
  config.optimization.minimizer = [
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      uglifyOptions: {
        output: {
          comments: false,
        },
      },
    }),
  ]
}

module.exports = config