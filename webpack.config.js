const path = require('path');

module.exports = {
  mode: 'production',
  entry: ['./js/index.js'],
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'reveal.min.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: [
            [ '@babel/preset-env' ]
          ]
        }
      }
    ]
  }
};