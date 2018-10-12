import * as ts from 'typescript';
import * as path from 'path';
import * as fs from 'fs';
import { hasProcessFlag, hasNpmFlag, isWebpackDevServer, root, debug } from './helpers';

export const DEFAULT_METADATA = {
  title: 'Tестовое задание',
  baseUrl: '/',
  isDevServer: isWebpackDevServer(),
  HMR: hasProcessFlag('hot'),
  AOT: process.env.BUILD_AOT || hasNpmFlag('aot'),
  WATCH: hasProcessFlag('watch'),
  tsConfigPath: 'tsconfig.webpack.json',

  /**
   * This suffix is added to the environment.ts file, if not set the default environment file is loaded (development)
   * To disable environment files set this to null
   */
  envFileSuffix: ''
};

export function supportES2015(tsConfigPath) {
  if (!supportES2015.hasOwnProperty('supportES2015')) {
    const tsTarget = readTsConfig(tsConfigPath).options.target;
    supportES2015['supportES2015'] = tsTarget !== ts.ScriptTarget.ES3 && tsTarget !== ts.ScriptTarget.ES5;
  }
  return supportES2015['supportES2015'];
}

export function readTsConfig(tsConfigPath) {
  const configResult = ts.readConfigFile(tsConfigPath, ts.sys.readFile);
  return ts.parseJsonConfigFileContent(configResult.config, ts.sys,
    path.dirname(tsConfigPath), undefined, tsConfigPath);
}

export function getEnvFile(suffix) {
  if (suffix && suffix[0] !== '.') {
    suffix = '.' + suffix;
  }

  if (suffix === null) {
    return;
  }

  let fileName = root(`src/environments/environment${suffix}.ts`);
  if (fs.existsSync(fileName)) {
    return fileName;
  } else if (fs.existsSync(fileName = root('src/environments/environment.ts'))) {
    console.warn(`Could not find environment file with suffix ${suffix}, loading default environment file`);
    return fileName;
  } else {
    throw new Error('Environment file not found.');
  }
}

/**
 * Read the tsconfig to determine if we should prefer ES2015 modules.
 * Load rxjs path aliases.
 * https://github.com/ReactiveX/rxjs/blob/master/doc/lettable-operators.md#build-and-treeshaking
 * @param supportES2015 Set to true when the output of typescript is >= ES6
 */
export function rxjsAlias(isSupES2015) {
  try {
    const rxjsPathMappingImport = isSupES2015 ? 'rxjs/_esm2015/path-mapping' : 'rxjs/_esm5/path-mapping';
    const rxPaths = require(rxjsPathMappingImport);
    return rxPaths(root('node_modules'));
  } catch (e) {
    return {};
  }
}

export function ngcWebpackSetup(prod, metadata) {
  if (!metadata) {
    metadata = DEFAULT_METADATA;
  }

  const buildOptimizer = prod && metadata.AOT;
  const sourceMap = true; // TODO: apply based on tsconfig value?
  const ngcWebpackPluginOptions = {
    skipCodeGeneration: !metadata.AOT,
    sourceMap,
    tsConfigPath: metadata.tsConfigPath,
  };

  const environment = getEnvFile(metadata.envFileSuffix);
  if (environment) {
    (ngcWebpackPluginOptions as any).hostReplacementPaths = {
      [root('src/environments/environment.ts')]: environment
    };
  }

  if (!prod && metadata.WATCH) {
    // Force commonjs module format for TS on dev watch builds.
    (ngcWebpackPluginOptions as any).compilerOptions = {
      module: 'commonjs'
    };
  }

  const buildOptimizerLoader = {
    loader: '@angular-devkit/build-optimizer/webpack-loader',
    options: {
      sourceMap
    }
  };

  const loaders = [
    {
      test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
      use: buildOptimizer ? [ buildOptimizerLoader, '@ngtools/webpack' ] : [ '@ngtools/webpack' ]
    },
    ...buildOptimizer
      ? [ { test: /\.js$/, use: [ buildOptimizerLoader ] } ]
      : []
  ];

  return {
    loaders,
    plugin: ngcWebpackPluginOptions
  };
}
