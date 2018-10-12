import { root } from '../helpers';

export const loaderScss = {
  test: /\.scss$/,
  use: ['style-loader', 'css-loader', 'sass-loader'],
  include: [
    root('src', 'styles')
  ]
};
