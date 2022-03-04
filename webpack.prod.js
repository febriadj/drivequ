const path = require('path');
const config = require('./webpack.config');

module.exports = {
  mode: 'production',
  output: {
    clean: true,
    path: path.resolve(__dirname, 'client/public'),
    filename: '[fullhash].js',
  },
  ...config,
};
