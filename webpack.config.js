const {
  VueLoaderPlugin
} = require('vue-loader');
var webpack = require('webpack')
const nodeSassMagicImporter = require('node-sass-magic-importer');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const env = process.env.NODE_ENV;
const minify = env === 'production';
const sourceMap = env === 'development';

const config = {
  entry: [
    path.join(__dirname, 'src', 'main.js')
  ],
  mode: env,
  output: {
    publicPath: '/',
  },
  optimization: {
    // splitChunks: {
    //   // Must be specified
    //   // for HtmlWebpackPlugin to work correctly.
    //   // See: https: //github.com/jantimon/html-webpack-plugin/issues/882
    //   chunks: 'all'
    // },
  },
  devtool: sourceMap ? 'cheap-module-eval-source-map' : undefined,
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
          {
            loader: 'css-loader',
            options: {
              sourceMap,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: path.join(__dirname, 'dist', 'index.html'),
      template: path.join(__dirname, 'static', 'index.html'),
      inject: true,
      minify: minify ? {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        // More options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      } : false,
    }),
    new CopyWebpackPlugin([{
      from: 'static/assets',
      to: 'assets'
    }]),
    new BrowserSyncPlugin({
      // browse to http://localhost:3000/ during development,
      // ./public directory is being served
      host: 'localhost',
      port: 3000,
      server: {
        baseDir: ['dist']
      }
    })
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
};

if (minify) {
  config.optimization.minimizer = [
    new OptimizeCSSAssetsPlugin(),
    // Enabled by default in production mode if
    // the 'minimizer' option isn't overridden.
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      uglifyOptions: {
        output: {
          comments: false,
        },
      },
    }),
  ];
}

if (env !== 'development') {
  config.plugins.push(new MiniCssExtractPlugin());

  const sassLoader = config.module.rules.find(({
    test
  }) => test.test('.scss'));
  // Replace the 'vue-style-loader' with
  // the MiniCssExtractPlugin loader.
  sassLoader.use[0] = MiniCssExtractPlugin.loader;
}

module.exports = config;