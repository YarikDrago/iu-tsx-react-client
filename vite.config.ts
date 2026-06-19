import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  /* Load environment variables */
  const env = loadEnv(mode, process.cwd(), '');

  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    plugins: [
      react(),
      svgr({
        svgrOptions: {
          exportType: 'default',
          ref: true,
          svgo: false,
          titleProp: true,
        },
        include: '**/*.svg',
      }),
      nodePolyfills({
        include: ['process', 'buffer'],
      }),
    ],
    server: {
      port: 3000,
      strictPort: true,
      proxy: {
        /* Prefix that will be replaced with the target url */
        '/api': {
          target: 'http://localhost:6600',
          changeOrigin: true,
          secure: false,
          /* remove prefix /api from the url
           * This prefix is added from the .env.proxy file */
          // rewrite: (path) => path.replace(/^\/api/, ''),
        },
        /* For socket.io it is necessary to manage proxying */
        '/socket.io': {
          target: 'http://localhost:6600',
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },
    base: '/',
    define: {
      /* Make process.env variables available */
      'process.env.API_URL': JSON.stringify(env.API_URL),
      'process.env.API_URL_COMMON': JSON.stringify(env.API_URL_COMMON),
      'process.env.API_URL_COMMON_DEV': JSON.stringify(env.API_URL_COMMON_DEV),
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
  };
});
