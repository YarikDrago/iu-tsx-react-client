import { formatInTimeZone } from 'date-fns-tz';
import Dotenv from 'dotenv-webpack';
import ESLintPlugin from 'eslint-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack, { HotModuleReplacementPlugin } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import { BuildOptions } from './types/config';

// import { CleanWebpackPlugin } from "clean-webpack-plugin";

export function buildPlugins(options: BuildOptions): webpack.WebpackPluginInstance[] {
  // Get current time in MSK locale
  const currentTime = new Date();
  const timeZone = 'Europe/Moscow';
  const buildTime = formatInTimeZone(currentTime, timeZone, 'dd.MM.yyyy HH:mm:ss zzz');

  const { paths, mode, envFileAddition, port, withAnalyzer = false } = options;
  const bundleAnalyzerPort = port + 1000;
  console.log('env file addition:', envFileAddition);
  const plugins: webpack.WebpackPluginInstance[] = [
    new Dotenv({
      path: `./.env${envFileAddition}`,
    }),
    new HtmlWebpackPlugin({
      template: `${paths.html}/index.html`,
      favicon: `${paths.html}/favicon.png`,
    }),
    //to show in percents bundling process.
    new webpack.ProgressPlugin(),
    // new CleanWebpackPlugin({
    //   cleanOnceBeforeBuildPatterns: ["!mainPageLinks.json"],
    // }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].css',
    }),
    new ForkTsCheckerWebpackPlugin({
      async: false,
    }),
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
      failOnError: false, // important to not fail the build on linting errors
      // failOnWarning: false, // important to not fail the build on linting warnings
      // context: paths.src,
      // cache: true,
      // cacheLocation: `${paths.build}/.eslintcache`,
      // fix: true,
    }),
    new webpack.DefinePlugin({
      'process.env.BUILD_TIME': JSON.stringify(buildTime),
      'process.env.APP_VERSION': JSON.stringify('1.6'),
      'process.env.GIT_HASH': JSON.stringify(options.gitHash),
    }),
  ];

  if (withAnalyzer) {
    plugins.push(
      new BundleAnalyzerPlugin({
        openAnalyzer: true,
        analyzerPort: bundleAnalyzerPort,
      })
    );
  }

  if (mode === 'development') {
    plugins.push(new HotModuleReplacementPlugin());
  }
  return plugins;
}
