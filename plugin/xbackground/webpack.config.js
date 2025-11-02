import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './xbackground.js',
  output: {
    path: path.resolve(__dirname, 'plugin'),
    filename: 'xbackground.js',
    library: {
      type: 'module'
    }
  },
  experiments: {
    outputModule: true
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }
      }
    ]
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  externalsType: 'global',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    static: {
      directory: path.join(__dirname, './')
    },
    compress: true,
    port: 9000,
    open: true,
    hot: true
  }
}
