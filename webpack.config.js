const path = require('path')

/** @type {import('webpack').Configuration} */
module.exports = {
  mode: 'production',
  entry: './src/content.ts',
  output: {
    filename: 'content.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  target: 'web',
  devtool: 'source-map',
  resolve: { extensions: ['.ts', '.js'] },
  module: {
    rules: [{ test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ }],
  },
}
