const InterpolateHtmlPlugin = require('interpolate-html-plugin');
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
    new InterpolateHtmlPlugin({
      PUBLIC_URL: '',
    }),
  ],
});
