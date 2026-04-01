require('ts-node').register({
  project: './tsconfig.webpack.json',
});

// webpack.config.ts экспортирует default (async (env) => ...)
module.exports = require('./webpack.config.ts').default;
