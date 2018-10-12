import { root } from '../helpers';
import * as autoprefixer from 'autoprefixer';

export const loaderAngularScss = {
  test: /\.scss$/,
  use: [
    {
      loader: 'to-string-loader'
    },
    {
      loader: 'css-loader',
      options: {
        sourceMap: true
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        plugins: [
          autoprefixer({
            browsers: ['ie >= 8', 'last 4 version']
          })
        ],
        sourceMap: true
      }
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true
      }
    }
  ],
  exclude: [root('src', 'styles'), root('src', 'app', 'themes')]
}