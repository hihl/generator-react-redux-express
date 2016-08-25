/**
 * Created by Zhengfeng Yao on 16/8/24.
 */
import webpackMerge from 'webpack-merge';
import webpack from 'webpack';
import common from './common';
import path from 'path';
import AssetsPlugin from 'assets-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
const fname = '[name].[chunkhash]';


module.exports = webpackMerge(common, {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    core: ['react', 'react-dom', 'redux', 'react-redux', 'redux-thunk', 'redux-logger'],
    lib: ['lodash', 'moment'],
    client: ['babel-polyfill', './src/client/entry']
  },
  output: {
    path: path.join(__dirname, '../../dist/client'),
    filename: fname + '.js',
    chunkFilename: '[chunkhash].chunk.js',
  },
  stats: {
    reason: true
  },
  module: {
    loaders: [
      {test: /\.jsx$/, loader: 'babel'},
      {test: /\.js$/, loader: 'babel', exclude: /\.es5\.js$/},
      {test: /\.less$/, loader: ExtractTextPlugin.extract('style',
        'css?sourceMap=true&modules&localIdentName=[local]!postcss!less')},
      {test: /\.css$/, loader: ExtractTextPlugin.extract('style',
        'css?sourceMap=true&modules&localIdentName=[local]!postcss')},
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      DEBUG: true,
      ONSERVER: false,
      'process.env.NODE_ENV': 'development'
    }),
    new ExtractTextPlugin(fname + '.css'),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['lib', 'core'],
      filename: '[name].[chunkhash].js',
    }),
    new AssetsPlugin({
      path: './dist/client',
      filename:'assets.json',
      update: true,
      prettyPrint: true,
    })
  ]
});
