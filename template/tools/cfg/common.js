/**
 * Created by Zhengfeng Yao on 16/8/24.
 */
import webpack from 'webpack';
import path from 'path';
const VERBOSE = process.argv.includes('--verbose');
const AUTOPREFIXER_BROWSERS = [
  'Android 2.3',
  'Android >= 4',
  'Chrome >= 35',
  'Firefox >= 31',
  'Explorer >= 9',
  'iOS >= 7',
  'Opera >= 12',
  'Safari >= 7.1',
  'last 3 versions',
  '>1%'
];

let chars = 0, lastState, lastStateTime;
function goToLineStart(nextMessage) {
  let str = "";
  for(; chars > nextMessage.length; chars--) {
    str += "\b \b";
  }
  chars = nextMessage.length;
  for(var i = 0; i < chars; i++) {
    str += "\b";
  }
  if(str) process.stderr.write(str);
}

module.exports = {
  output: {
    publicPath: '/',
    sourcePrefix: '  ',
  },
  stats: {
    colors: true,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE,
  },
  module: {
    loaders: [
      {test: /\.json$/, loader: 'json'},
      {test: /\.json5$/, loader: 'json5'},
      {test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/, loader: 'url?limit=8192'},
      {test: /\.(eot|ttf|wav|mp3|mp4)$/, loader: 'file'},
      {test: /\.txt$/,loader: 'raw',}
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(function(percentage, msg) {
      var state = msg;
      if(percentage < 1) {
        percentage = Math.floor(percentage * 100);
        msg = percentage + "% " + msg;
        if(percentage < 100) {
          msg = " " + msg;
        }
        if(percentage < 10) {
          msg = " " + msg;
        }
      }
      state = state.replace(/^\d+\/\d+\s+/, "");
      if(percentage === 0) {
        lastState = null;
        lastStateTime = +new Date();
      } else if(state !== lastState || percentage === 1) {
        var now = +new Date();
        if(lastState) {
          var stateMsg = (now - lastStateTime) + "ms " + lastState;
          goToLineStart(stateMsg);
          process.stderr.write(stateMsg + "\n");
          chars = 0;
        }
        lastState = state;
        lastStateTime = now;
      }
      goToLineStart(msg);
      process.stderr.write(msg);
    }),
    new webpack.optimize.OccurenceOrderPlugin(true)
  ],
  resolve: {
    root: path.resolve(process.cwd()),
    extensions: ['', '.js', '.jsx', '.json', 'json5'],
  },
  postcss: function() {
    return [
      require('postcss-nested')(),
      require('pixrem')(),
      require('autoprefixer')({browsers: AUTOPREFIXER_BROWSERS}),
      require('postcss-flexibility')(),
      require('postcss-discard-duplicates')()
    ];
  },
};
