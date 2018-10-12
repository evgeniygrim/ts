import { root } from '../helpers';

export const loaderCss = {
  test: /\.css$/,
  use: ['style-loader', 'css-loader'],
  include: [root('src', 'styles')]
};
