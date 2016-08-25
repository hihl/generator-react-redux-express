/**
 * Created by Zhengfeng Yao on 16/8/24.
 */
import webpackMerge from 'webpack-merge';
import webpack from 'webpack';
import common from './common';
import path from 'path';
import fs from 'fs';
const srcs = [path.resolve(process.cwd(), 'src')];

module.exports = webpackMerge(common, {
  entry: ['babel-polyfill', './src/server/entry'],
  target: 'node',
  output: {
    libraryTarget: 'commonjs2',
    path: './dist',
    filename: 'server.js',
  },
  externals: ['socket.io', 'express'],
  module: {
    loaders: [
      {test: /\.jsx$/, loader: 'babel'},
      {test: /\.js$/, loader: 'babel', include: srcs, exclude: /\.es5\.js$/},
      {test: /\.less$/, loader: 'css/locals?sourceMap=true&modules&localIdentName=[local]!postcss!less'},
      {test: /\.css$/, loader: 'css/locals?sourceMap=true&modules&localIdentName=[local]!postcss'},
    ]
  },
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      DEBUG: true,
      ONSERVER: true
    }),
    new webpack.BannerPlugin('require("source-map-support").install();',
      { raw: true, entryOnly: false })
  ]
});
