const webpack = require('webpack')
const path = require('path')
const glob = require('glob')

const PreloadWebpackPlugin = require('preload-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const nodeExternals = require('webpack-node-externals');

const env = process.env.NODE_ENV

let specsEntries = glob.sync(path.resolve(__dirname, '../src/levels') + '/level*/*.spec.js').reduce((acc, file) => {
  acc[file.replace(/^.*\//, '')] = file
  return acc
}, {})

let entries = Object.assign(specsEntries, {
  'LevelSpecTester.js': path.resolve(__dirname, '../tests/LevelSpecTester.js')
})

const config = {
  target: "node",
  entry: entries,
  mode: env,
  output: {
    path: path.resolve(__dirname, '../tests-build'),
    filename: '[name]',
    libraryTarget: "commonjs2",
  },
  externals: [nodeExternals()],
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      include: [path.join(__dirname, 'src')],
    }, ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      ENV: JSON.stringify(env),
    })
  ],
  resolve: {
    extensions: ['*', '.js']
  },
}

module.exports = config