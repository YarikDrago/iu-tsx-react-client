import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';

import { BuildOptions } from './types/config';

export function buildDevServer(options: BuildOptions): DevServerConfiguration {
  const { paths } = options;
  return {
    static: paths.build,
    historyApiFallback: true,
    port: options.port,
    open: true,
    hot: true,
    proxy: [
      {
        /* Prefixes that will be replaced with the target url */
        context: ['/api'],
        // TODO change and use variable (env)
        target: `http:localhost:6600/api`,
        changeOrigin: true,
        secure: false,
        /* remove prefix /api from the url
         * This prefix is added from the .env.proxy file */
        // pathRewrite: { '^/api': '' },
      },
    ],
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  };
}
