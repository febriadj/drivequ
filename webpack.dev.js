const path = require('path');
const config = require('./webpack.config');

module.exports = {
  mode: 'development',
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'client/public'),
    },
    port: 3000,
    open: true,
    hot: true,
    historyApiFallback: true,
  },
  ...config,
};
