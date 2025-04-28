const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: "development",
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', 
      filename: 'index.html'
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'build'), // HTML
    },
    compress: true,
    port: 3000,
    hot: true,
    open: true, // ブラウザ自動オープン
    historyApiFallback: true,
    proxy: [
      {
        context: ['/api/submit', '/api/analysis_graphs', '/api/save_goal','/api/goal','/api/analysis'],
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    ]
  }
};
