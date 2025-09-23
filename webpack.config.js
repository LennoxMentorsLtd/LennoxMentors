'use strict';

import fs from 'fs';
import HtmlBundlerPlugin from 'html-bundler-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const entry = {
  core: [
    './assets/index.js',
    './assets/index.scss',
    './assets/images/favicon.png',
    './assets/images/seo/index.png',
    './assets/images/seo/about.png',
    './assets/images/seo/contact.png',
    './assets/images/seo/mentoring.png'
  ],
};

const globalData = {
  site_url: process.env.SITE_URL
};

const getPageData = (fileDir, fileName) => {
  const blob = path.join(fileDir, `${fileName}.data.json`);

  if (!fs.existsSync(blob)) {
    return globalData;
  }

  const data = {};

  try {
    data = JSON.parse(fs.readFileSync(blob, 'utf-8'));
  }
  catch (e) {
    console.error(`Error parsing ${blob}`)
  }

  return { ...globalData, ...data };
}

// Dynamically load all .njk files from the pages directory
// and include their corresponding .data.json file
const pageEntries = () => {
  const entries = {};
  const dir = path.join(__dirname, 'pages');
  const files =  fs.readdirSync(dir);

  files.forEach(file => {
    if (file.endsWith('.njk')) {
      const fileName = path.basename(dir, file, '.njk');

      entries[fileName] = {
        import: `pages/${file}`,
        data: getPageData(fileName)
      };
    }
  });

  return entries;
}

const plugins = [
  new MiniCssExtractPlugin({
    filename: 'dist/[name].css',
  }),
  new HtmlBundlerPlugin({
    entry: pageEntries(),
    outputPath: resolve(__dirname, 'wwwroot'),
    preprocessor: 'nunjucks',
    minify: {
      removeComments: true,
    }
  })
];

const moduleConfig = {
  rules: [
    {
      test: /\.js$/,
      include: resolve(__dirname, 'assets'),
      use: 'babel-loader',
    },
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
        filename: 'dist/images/[name][ext][query]'
      }
    },
    {
      test: /\.(woff2?|eot|ttf|otf)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'dist/fonts/[name][ext][query]'
      }
    }
  ]
};

export default {
  mode: 'production',
  entry,
  plugins,
  output: {
    path: resolve(__dirname, 'wwwroot'),
    filename: 'dist/[name].js',
    clean: true
  },
  resolve: {
    extensions: ['.js', '.scss', '.css', '.njk']
  },
  devtool: 'source-map',
  module: moduleConfig
};
