'use strict';

import fs from 'fs';
import HtmlBundlerPlugin from 'html-bundler-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import SitemapPluginModule from 'sitemap-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const entry = {
  core: [
    './assets/index.js',
    './assets/index.scss',
    './assets/images/favicon.png',
    './assets/images/seo/og_index.png',
    './assets/images/seo/og_about.png',
    './assets/images/seo/og_contact.png',
    './assets/images/seo/og_mentoring.png'
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

  let data = {};

  try {
    data = JSON.parse(fs.readFileSync(blob, 'utf-8'));
  }
  catch (e) {
    console.error(`Error parsing ${blob}`, e.message)
  }

  return { ...globalData, ...data };
}

const { entries, sitemap } = (() => {
  const entries = {};

  const baseDir = path.join(__dirname, 'pages');
  const sitemap = [];

  fs.readdirSync(baseDir).forEach(file => {
    if (file.endsWith('.njk')) {
      const filenameWithoutExt = path.basename(file, '.njk');
      entries[filenameWithoutExt] = {
        import: `pages/${file}`,
        data: getPageData(baseDir, filenameWithoutExt)
      };
      sitemap.push(filenameWithoutExt);
    }
  });

  return { entries, sitemap };
})();

const plugins = [
  new MiniCssExtractPlugin({
    filename: 'dist/[name].css',
  }),
  new HtmlBundlerPlugin({
    entry: entries,
    outputPath: resolve(__dirname, 'wwwroot'),
    preprocessor: 'nunjucks',
    minify: {
      removeComments: true,
    }
  }),
  new SitemapPluginModule.default({
    base: process.env.SITE_URL || 'http://localhost:3030',
    paths: sitemap,
    options: {
      lastmod: true,
      changefreq: 'weekly',
      skipgzip: true
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
        filename: (pathData) => {
          const rawImageDir = path.resolve(__dirname, path.join('assets', 'images'));
          return path.join('dist', 'images', path.relative(rawImageDir, pathData.filename))
        }
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
