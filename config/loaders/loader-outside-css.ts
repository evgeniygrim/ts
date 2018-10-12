import { root } from '../helpers';

export const loaderOutsideStyle = {
  test: /\.css$/,
  use: ['to-string-loader', 'css-loader'],
  exclude: [root('src', 'styles'), /node_modules/]
};
