const isProductionMode = process.env.NODE_ENV === 'production';

const fs = require('fs');
const path = require('path');
const currentDirectory = process.cwd();

const outputFilename = 'static/js/[name].[hash:8].js';
const CSSoutputFilename = 'static/css/[name].[contenthash:8].chunk.css';

const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const TerserPlugin = require('terser-webpack-plugin');
const TerserConfig = require(path.join(__dirname, 'config', 'terser.config.js'));

const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CSSOptimizerConfig = require(path.join(__dirname, 'config', 'css.optimize.js'));
const PostCSSConfig = require(path.join(__dirname, 'config', 'postcss.config.js'));

const BabelConfig = require(path.join(__dirname, 'config', 'babel.config.js'));

const styleLoaders = (...additionalLoaders) => {
  let loaders = [
    {
      loader: MiniCssExtractPlugin.loader
    },
    {
      loader: 'css-loader',
      options: {
        modules: true,
        sourceMap: true,
        importLoaders: 1 + additionalLoaders.length,
        localIdentName: isProductionMode ? '[hash:base64:5]' : '[local]__[hash:base64:5]'
      }
    },
    {
      loader: require.resolve('postcss-loader'),
      options: PostCSSConfig
    }
  ];
  loaders.push(...additionalLoaders);

  return loaders;
};

const srcPath = path.join(currentDirectory, 'src');
const distPath = path.join(currentDirectory, 'dist');
const assetsPath = path.join(srcPath, 'assets');

module.exports = {
  mode: isProductionMode ? 'production' : 'development',
  entry: [path.join(srcPath, 'index.js')],
  devtool: isProductionMode ? false : 'inline-source-map',
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          enforce: true
        }
      }
    },
    sideEffects: true,
    usedExports: true,
    runtimeChunk: true,
    minimize: isProductionMode,
    minimizer: [new TerserPlugin(TerserConfig), new OptimizeCSSAssetsPlugin(CSSOptimizerConfig)]
  },
  output: {
    path: distPath,
    filename: outputFilename,
    chunkFilename: outputFilename,
    publicPath: '/'
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: path.join(__dirname, 'config', 'babel.loader.js'),
            options: {
              root: path.join(currentDirectory, 'src'),
              ...BabelConfig
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: styleLoaders()
      },
      {
        test: /\.(scss|sass)$/,
        use: styleLoaders('sass-loader')
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(isProductionMode)
    }),
    new MiniCssExtractPlugin({
      filename: CSSoutputFilename,
      chunkFilename: CSSoutputFilename
    }),
    new HtmlWebpackPlugin({
      template: path.join('public', 'index.html'),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    new CleanWebpackPlugin({
      verbose: false
    }),
    new CopyWebpackPlugin([
      {
        from: 'public',
        ignore: ['index.html']
      }
    ])
  ],
  stats: { children: false },
  devServer: { stats: { children: false }, compress: true },
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.sass', '.css']
  }
};
