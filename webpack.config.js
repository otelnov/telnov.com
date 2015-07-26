var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: path.join(__dirname, '/www'),

  devtool: 'source-map',

  resolve: {
    alias: {
      bootstrapCSS: './lib/bootstrap/css/bootstrap.min.css',
      bootstrapJS: './lib/bootstrap/js/bootstrap.min.js',
      affix: './lib/affix.js',
      ajquery: './lib/angular-jquery.js'
    }
  },

  entry: {
    common: ['angular', 'angular-ui-router', 'oclazyload', './app.js'],
    wedding: './components/wedding',
    football: './components/football',
    pebble: './components/pebble'
  },
  output: {
    path: path.join(__dirname, '/www/build'),
    publicPath: '/build/',
    filename: '[name].bundle.js'
  },

  plugins: [
    new webpack.DefinePlugin({
      /*eslint-disable */
      ON_DEV: process.env.NODE_ENV !== 'production',
      ON_PROD: process.env.NODE_ENV === 'production'
      /*eslint-enable */
    }),
    new webpack.optimize.CommonsChunkPlugin('common', 'common.bundle.js'),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
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
