const HtmlWebPackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
module.exports = () => ({
  module: {
    rules: [
      {
        test: /\.sa?css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new InterpolateHtmlPlugin(HtmlWebPackPlugin, {
      PUBLIC_URL: '',
    }),
  ],
});
