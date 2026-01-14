import path from 'path';
import { ResolveOptions } from 'webpack';

import { BuildOptions } from './types/config';

export function buildResolvers(options: BuildOptions): ResolveOptions {
  const { paths } = options;
  return {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@models': path.resolve(paths.src, 'models'),
      '@': path.resolve(paths.src),
      Test: path.resolve(paths.src),
    },
  };
}
