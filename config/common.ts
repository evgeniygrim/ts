import * as path from 'path';

import { DEFAULT_METADATA, ngcWebpackSetup, rxjsAlias, supportES2015 } from './build-utils';
import { root as rootPath } from './helpers';
import {
    loaderAngularScss, loaderCss, loaderFiles, loaderFonts, loaderHtml, loaderOutsideStyle,
    loaderScss, loaderVendors
} from './loaders';
import { plugins } from './plugins';

const root = rootPath('src');
const nodeModules = rootPath('node_modules');
const appRoot = rootPath('src', 'app');
const coreRoot = rootPath('src', 'core');

const aliases = {
  '@app': appRoot,
  '@core': coreRoot,
};

export function common(options) {
  const entry = {
    polyfills: './src/polyfills.browser.ts',
    main: './src/main.browser.ts',
    vendor: './src/vendor.ts'
  };

  const METADATA = Object.assign({}, DEFAULT_METADATA, options.metadata || {});
  const ngcWebpackConfig = ngcWebpackSetup(options.env === 'production', METADATA);
  const alias = Object.assign({}, rxjsAlias(supportES2015), aliases);

  Object.assign(ngcWebpackConfig.plugin, {
    tsConfigPath: METADATA.tsConfigPath,
    mainPath: entry.main
  });

  const rules = [
    ...ngcWebpackConfig.loaders,
    loaderVendors,
    loaderOutsideStyle,
    loaderAngularScss,
    loaderHtml,
    loaderFiles,
    loaderFonts,
    loaderScss,
    loaderCss,
  ];

  const pluginsBundle = [...plugins(options, METADATA)];

  return {
    entry: entry,
    resolve: {
      mainFields: [...(supportES2015 ? ['es2015'] : []), 'browser', 'module', 'main'],
      extensions: ['.ts', '.js', '.json'],
      modules: [root, nodeModules, appRoot, coreRoot],
      alias: alias,
    },
    module: {
      rules: rules,
    },
    plugins: pluginsBundle,
    node: {
      global: true,
      crypto: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }
  };
}
