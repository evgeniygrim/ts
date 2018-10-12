import * as path from 'path';
import { DEFAULT_METADATA } from './build-utils';

const EVENT = process.env.npm_lifecycle_event || '';

/**
 * Helper functions.
 */
const ROOT = path.resolve(__dirname, '..');

export function hasProcessFlag(flag) {
  return process.argv.join('').indexOf(flag) > -1;
}

export function hasNpmFlag(flag) {
  return EVENT.includes(flag);
}

export function isWebpackDevServer() {
  return process.argv[1] && !! (/webpack-dev-server/.exec(process.argv[1]));
}

export const root = path.join.bind(path, ROOT);

export function debug(data, message) {
  console.warn(`\n ------------------------ \n
    ${message} : \n ${JSON.stringify(data)}
  \n ------------------------ \n`);
}
