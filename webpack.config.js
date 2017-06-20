var path = require('path');

module.exports = {
  entry: './src/javascripts/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
