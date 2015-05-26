var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: path.join(__dirname, '/www'),

  devtool: 'source-map',

  resolve: {
    alias: {
      bootstrap: './lib/bootstrap/css/bootstrap.min.css'
    }
  },

  entry: {
    common: ['bootstrap', './css/main.css', 'angular', 'angular-ui-router', 'oclazyload', './app.js'],
    wedding: './components/wedding'
  },
  output: {
    path: path.join(__dirname, '/www/build'),
    publicPath: '/build/',
    filename: '[name].bundle.js'
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin('common', 'common.bundle.js')
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules|www\/lib/
      },
      {
        test: /\.js$/,
        loader: 'eslint',
        exclude: /node_modules|www\/lib/
      },
      {
        test: /\.html$/,
        loader: 'raw',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style!css',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192',
        exclude: /node_modules/
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff",
        exclude: /node_modules/
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff2",
        exclude: /node_modules/
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/octet-stream",
        exclude: /node_modules/
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file",
        exclude: /node_modules/
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=image/svg+xml",
        exclude: /node_modules/
      }
    ]
  }
};
