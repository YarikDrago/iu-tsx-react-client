import path from 'path';
import { WebpackConfiguration } from 'webpack-cli';

import { buildWebpackConfig } from './config/build/buildWebpackConfig';
import { BuildEnv, BuildPaths } from './config/build/types/config';

export default async (env: BuildEnv) => {
  const rootDir = process.cwd();

  const paths: BuildPaths = {
    entry: path.resolve(rootDir, 'src', 'index.tsx'),
    build: path.resolve(rootDir, 'dist'),
    html: path.resolve(rootDir, 'public'),
    src: path.resolve(rootDir, 'src'),
  };

  const mode = env.NODE_ENV || 'development';
  const PORT = Number(env.port) || 3000;
  const envFileAddition = env.envFile ? '.' + env.envFile : '';
  const withAnalyzer = env.analyzer || false;

  console.log('move to build Webpack config');

  const config: WebpackConfiguration = buildWebpackConfig({
    paths,
    mode,
    port: PORT,
    envFileAddition,
    withAnalyzer,
  });

  return config;
};
