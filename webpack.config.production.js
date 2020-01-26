const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');

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
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin([
      { from: 'public/fonts', to: 'fonts' },
      { from: 'public/favicon.ico', to: '' },
    ]),
    new InterpolateHtmlPlugin({
      PUBLIC_URL: '.',
    }),
  ],
});
