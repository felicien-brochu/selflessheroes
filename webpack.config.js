var webpack = require('webpack')
const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')
const VueLoader = require('vue-loader')

const env = process.env.NODE_ENV

const config = {
  entry: {
    app: [path.resolve(__dirname, 'src/main.js')],
    phaser: ['phaser']
  },
  mode: env,
  output: {
    publicPath: '',
    filename: '[name].js'
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
  },
  devtool: env === 'development' ? 'inline-source-map' : undefined,
  devServer: {
    contentBase: 'dist',
    port: 3000,
    historyApiFallback: true
  },
  module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        include: [
          path.join(__dirname, 'static', 'assets'),
          path.join(__dirname, 'src')
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.join(__dirname, 'src')],
      },
      {
        test: /\.worker\.js$/,
        loader: 'worker-loader',
        options: {
          name: 'workers/[name].[ext]'
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'assets/images'
        }
      },
      {
        test: /\.(eot|svg|ttf|woff2?)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'assets/fonts'
        }
      }
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([{
      context: 'src/levels',
      from: '**',
      to: 'levels',
      ignore: ['model/**/*', '*.js', '*.tmx']
    }]),
    new MiniCssExtractPlugin(),
    new VueLoader.VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: path.join(__dirname, 'dist', 'index.html'),
      template: path.join(__dirname, 'src', 'index.html'),
      inject: true
    })
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json', ]
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