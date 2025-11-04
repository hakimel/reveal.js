/**
 * Webpack Configuration for XShadcn Reveal.js Plugin
 *
 * This configuration bundles the plugin and its components for distribution.
 * React and ReactDOM are marked as externals since they're loaded via CDN.
 */

const path = require('path');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  return {
    // Entry point - the main plugin file
    entry: './plugin/xshadcn.js',

    // Output configuration
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'xshadcn.js',
      // ES module output
      library: {
        type: 'module'
      },
      // Clean dist folder before each build
      clean: true,
      // Environment configuration
      environment: {
        module: true,
        dynamicImport: true
      }
    },

    // Enable ES modules
    experiments: {
      outputModule: true
    },

    // Resolve configuration
    resolve: {
      extensions: ['.js', '.jsx'],
      // Ensure node_modules are resolved correctly
      modules: ['node_modules']
    },

    // External dependencies (loaded via CDN in HTML)
    // Note: With ES module output, we use import syntax for externals
    externalsType: 'module',
    externals: {
      'react': 'react',
      'react-dom': 'react-dom',
      'react-dom/client': 'react-dom/client',
      'clsx': 'clsx',
      'tailwind-merge': 'tailwind-merge'
    },

    // Module rules
    module: {
      rules: [
        {
          // JavaScript and JSX files
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-react', {
                  runtime: 'automatic' // Use automatic JSX runtime
                }]
              ],
              // Cache for faster rebuilds
              cacheDirectory: true
            }
          }
        },
        {
          // CSS files (if any)
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },

    // Source maps
    devtool: isDevelopment ? 'eval-source-map' : 'source-map',

    // Development server configuration
    devServer: {
      static: {
        directory: path.join(__dirname),
      },
      compress: true,
      port: 9000,
      hot: true,
      open: false,
      // Enable CORS for CDN resources
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    },

    // Performance hints
    performance: {
      hints: isDevelopment ? false : 'warning',
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },

    // Optimization configuration
    optimization: {
      // Minimize in production only
      minimize: !isDevelopment,
      // Use default minimizer settings
      usedExports: true
    },

    // Build mode
    mode: isDevelopment ? 'development' : 'production',

    // Target browser environment
    target: 'web',

    // Stats output
    stats: {
      colors: true,
      errors: true,
      warnings: true,
      modules: false,
      children: false
    }
  };
};
