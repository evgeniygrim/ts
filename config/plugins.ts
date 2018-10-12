import { root as rootPath, debug } from './helpers';
import { ngcWebpackSetup } from './build-utils';

import { HtmlElementsPlugin } from './html-elements-plugin';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as InlineManifestWebpackPlugin from 'inline-manifest-webpack-plugin';
import * as ngcWebpack from 'ngc-webpack';
import * as ScriptExtHtmlWebpackPlugin from 'script-ext-html-webpack-plugin';
import * as webpack from 'webpack';
import * as DefinePlugin from 'webpack/lib/DefinePlugin';
import * as LoaderOptionsPlugin from 'webpack/lib/LoaderOptionsPlugin';
import * as CommonsChunkPlugin from 'webpack/lib/optimize/CommonsChunkPlugin';
import { config as headConfig } from './head-config.common';

export const plugins = (options, meta?) => {

  const ngcWebpackConfig = ngcWebpackSetup(options.env === 'production', meta);

  return [
    new DefinePlugin({
      'ENV': JSON.stringify(meta.ENV),
      'process.env.ENV': JSON.stringify(meta.ENV),
    }),
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      rootPath('./src'),
      {},
    ),
    new webpack.ContextReplacementPlugin(
      /moment[\/\\]locale$/,
      /en|ru/,
    ),
    new CommonsChunkPlugin({
      name: 'polyfills',
      chunks: ['polyfills']
    }),
    new CommonsChunkPlugin({
      minChunks: Infinity,
      name: 'inline'
    }),
    new CommonsChunkPlugin({
      name: 'vendor',
      chunks: ['vendor']
    }),
    new CommonsChunkPlugin({
      name: 'main',
      async: 'common',
      children: true,
      minChunks: 3
    }),
    new webpack.ProvidePlugin({
      moment: 'moment'
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/assets',
        to: 'assets'
      },
      {
        from: 'src/meta'
      },
      {
        from: 'src/assets/icon/favicon.ico',
        to: 'favicon.ico'
      },
    ],
    {
      copyUnmodified: false,
      ignore: options.env === 'production' ? ['mocks/**/*'] : undefined
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      title: meta.title,
      chunksSortMode: function(a, b) {
        const entryPoints = ['inline', 'polyfills', 'sw-register', 'styles', 'vendor', 'main'];
        return entryPoints.indexOf(a.names[0]) - entryPoints.indexOf(b.names[0]);
      },
      metadata: meta,
      inject: 'body',
      xhtml: true,
      minify: options.env === 'production' ? {
        caseSensitive: true,
        collapseWhitespace: true,
        keepClosingSlash: true
      } : false
    }),
    new ScriptExtHtmlWebpackPlugin({
      sync: /inline|polyfills|vendor/,
      defaultAttribute: 'async',
      preload: [/polyfills|vendor|main/],
      prefetch: [/chunk/]
    }),
    new HtmlElementsPlugin({
      headTags: headConfig,
    }),
    new LoaderOptionsPlugin({}),
    new ngcWebpack.NgcWebpackPlugin(ngcWebpackConfig.plugin),
    new InlineManifestWebpackPlugin(),
  ];
};
