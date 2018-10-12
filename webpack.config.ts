import prod from './config/webpack.prod';
import dev from './config/webpack.dev';

/**
 * Look in ./config folder for webpack.dev.js
 */
switch (process.env.NODE_ENV) {
  case 'prod':
  case 'production':
    module.exports = prod({env: 'production'});
    break;
  case 'dev':
  case 'development':
  default:
    module.exports = dev({env: 'development'});
}
