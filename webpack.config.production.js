const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = () => ({
  devtool: 'nosource-source-map',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.sa?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin([
      { from: 'public/fonts', to: 'fonts' },
      { from: 'public/favicon.ico', to: '' },
      { from: 'public/susi-chatbot.js', to: '' },
      { from: 'public/CNAME', to: '' },
      { from: 'public/favicon.ico', to: '' },
      { from: 'public/favicon-16x16.png', to: '' },
      { from: 'public/favicon-32x32.png', to: '' },
      { from: 'public/403.html', to: '' },
    ]),
  ],
});
