import { root } from '../helpers';

export const loaderHtml = {
  test: /\.html$/,
  use: 'raw-loader',
  exclude: [root('src/index.html')]
};
