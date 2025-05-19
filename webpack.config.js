'use strict';

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const entry = {
  index: './assets/index.scss'
};

const plugins = [
  new MiniCssExtractPlugin({
    filename: '[name].css',
  }),
];

const moduleConfig = {
  rules: [
    {
      test: /\.s?css$/,
      include: resolve(__dirname, 'assets'),
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'sass-loader'
      ]
    },
    {
      test: /\.(png|jpe?g|gif|svg)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'images/[name][ext][query]'
      }
    },
    {
      test: /\.(woff2?|eot|ttf|otf)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'fonts/[name][ext][query]'
      }
    },
    {
      test: /\.(njk)$/,
      use: [{ loader: 'simple-nunjucks-loader' }]
    }
  ]
};

export default {
  mode: 'production',
  entry,
  plugins,
  output: {
    path: resolve(__dirname, 'wwwroot', 'dist'),
    filename: '[name].js',
    clean: true
  },
  resolve: {
    extensions: ['.js', '.scss', '.css', '.njk']
  },
  devtool: 'source-map',
  module: moduleConfig
};
