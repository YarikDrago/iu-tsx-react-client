import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack from 'webpack';

import { BuildOptions } from './types/config';

export function buildLoaders(options: BuildOptions): webpack.RuleSetRule[] {
  const { mode } = options;
  const isDev = mode === 'development';

  const svgLoader = {
    test: /\.svg$/,
    use: ['@svgr/webpack'],
  };

  const babelLoader = {
    test: /\.(ts|js)x?$/i,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
      },
    },
  };

  const styleLoader = {
    test: /\.s[ac]ss$/i,
    use: [
      mode !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
      {
        /** Enables JavaScript to import and process CSS files.
                 Resolves @import and url() statements inside CSS files.
                 Enables CSS Modules, which help scope styles locally to components. */
        loader: 'css-loader',
        options: {
          // CSS modules settings
          modules: {
            // Determines whether CSS modules should be enabled for a specific file
            auto: (resPath: string) => resPath.includes('.module.'),
            // Specifies the naming pattern for CSS class names in the compiled output
            localIdentName: isDev
              ? '[path][name]__[local]--[hash:base64:5]' // Readable class names in dev mode
              : '[hash:base64:8]', // Short hashed class names in production
          },
        },
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
          sassOptions: {
            includePaths: [path.resolve(__dirname, 'src')],
          },
        },
      },
    ],
  };

  // const typescriptLoader = {
  //   test: /\.tsx?$/,
  //   use: 'ts-loader',
  //   exclude: /node_modules/,
  // };

  const fileLoader = {
    test: /\.(jpe?g|gif|pdf|mp3)$/,
    // alternative old plugin. Depends on representation of files in browsers
    // use: ['file-loader']
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 8192,
        },
      },
    ],
  };

  const pngLoader = {
    // test: /\.(ico|png|jpg|gif|pdf|woff(2)?)$/,
    test: /\.(png)$/,
    exclude: /node_modules/,
    type: 'asset/resource',
    generator: {
      filename: 'images/[name][ext]',
    },
  };

  const videoLoader = {
    test: /\.(mp4|webm|ogg)$/i,
    type: 'asset/resource', // Save as separate file
    // generator: {
    //   filename: 'videos/[name][ext]',
    // },
  };

  return [svgLoader, babelLoader, styleLoader, fileLoader, pngLoader, videoLoader];
}
