const HtmlWebPackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const path = require('path');
const webpackExtension = mode => require(`./webpack.config.${mode}.js`)();

module.exports = ({ mode }) => {
  var mergedConfig = merge(
    {
      mode,
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
            },
          },
          {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
          },
          {
            test: /\.(png|svg|jpg|gif|jpeg)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: '[name].[ext]',
                  esModule: false,
                },
              },
            ],
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: '[name].[ext]',
                  esModule: false,
                },
              },
            ],
          },
          {
            test: /\.(mov|mp4)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: '[name].[ext]',
                },
              },
            ],
          },
          {
            test: /\.html$/,
            use: [
              {
                loader: 'html-loader',
              },
            ],
          },
        ],
      },
      plugins: [
        new HtmlWebPackPlugin({
          template: path.resolve(__dirname, 'public/index.html'),
          filename: 'index.html',
        }),
      ],
      devServer: {
        historyApiFallback: true,
        contentBase: path.join(__dirname, 'public'),
        port: 3000,
        hot: true,
      },
      entry: {
        index: [
          './src/index.js',
          './public/js/index.js',
          './public/js/recaptcha.js',
          './public/js/charts.js',
          './public/susi-chatbot.js',
        ],
      },
      output: {
        publicPath: '/',
        path: path.resolve(__dirname, 'build'),
        filename: 'bundled.js',
      },
    },
    webpackExtension(mode),
  );

  // eslint-disable-next-line camelcase
  return mergedConfig;
};
