const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require("path");
require("babel-polyfill")

module.exports = {
  entry: ['babel-polyfill', __dirname + '/src/app/script.js'],
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: { presets: ['@babel/env','@babel/preset-react'] },
      },
      {
        test: /\.s?css$/,
		use: ['style-loader', 'css-loader', 'sass-loader']    
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + '/src/public/index.html',
      inject: 'body'
    }),
    new ExtractTextPlugin('style.css')
  ],
  devServer: {
    contentBase: './src/public',
    port: 7700
  }
}
