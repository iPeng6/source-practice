const path = require('path')

module.exports = {
  mode: 'development',
  entry: './vue.js',
  output: {
    filename: 'vue.js',
    library: 'Vue',
    libraryExport: 'default',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'source-map',
}
