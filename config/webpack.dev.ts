import * as apiMocker from 'connect-api-mocker';
import * as EvalSourceMapDevToolPlugin from 'webpack/lib/EvalSourceMapDevToolPlugin';
import * as LoaderOptionsPlugin from 'webpack/lib/LoaderOptionsPlugin';
import * as NamedModulesPlugin from 'webpack/lib/NamedModulesPlugin';

import { DEFAULT_METADATA } from './build-utils';
import { common as commonConfig } from './common';
import { hasProcessFlag, root } from './helpers';

import * as merge from 'webpack-merge';

const config = (options) => {
  const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
  const HOST = process.env.HOST || '0.0.0.0';
  const PORT = process.env.PORT || 4200;

  const METADATA = Object.assign({}, DEFAULT_METADATA, {
    host: HOST,
    port: PORT,
    ENV: ENV,
    HMR: hasProcessFlag('hot'),
    PUBLIC: process.env.PUBLIC_DEV || `${HOST}:${PORT}`
  });

  return merge(commonConfig({env: ENV, metadata: METADATA}), {
    output: {
      path: root('dist'),
      filename: '[name].bundle.js',
      sourceMapFilename: '[file].map',
      chunkFilename: '[id].chunk.js',
      library: 'ac_[name]',
      libraryTarget: 'var',
    },
    plugins: [
      new EvalSourceMapDevToolPlugin({
        moduleFilenameTemplate: '[resource-path]',
        sourceRoot: 'webpack:///'
      }),
      new NamedModulesPlugin(),
      new LoaderOptionsPlugin({
        debug: true,
        options: {}
      }),
    ],
    devServer: {
      port: METADATA.port,
      host: METADATA.host,
      hot: METADATA.HMR,
      public: METADATA.PUBLIC,
      historyApiFallback: true,
      watchOptions: {
        poll: 1000,
        ignored: /node_modules/
      },
      proxy: {
        '/bivsberlossws/rest/lk-gate/*': {
          target: 'http://localhost:8080',
          secure: false,
          changeOrigin: true,
          headers: {
            'http-x-requested-with': 'XMLHttpRequest'
          }
        }
      },
      setup: function(app) {
      },
      before: function(app) {
        app.use(apiMocker('mocks', {
          target: 'mocks/mock',
        }));
      },
    },
  });
};

export default config;
