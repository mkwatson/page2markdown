const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bookmarklet.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'self',
      export: 'default'
    }
  },
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
            ascii_only: true,
            // Remove all whitespace where possible
            beautify: false
          },
          compress: {
            passes: 3,
            unsafe: true,
            // Additional aggressive compression options
            collapse_vars: true,
            pure_getters: true,
            unsafe_math: true,
            unsafe_methods: true,
            unsafe_proto: true,
            unsafe_regexp: true,
            pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
            drop_console: true,
            sequences: true,
            booleans: true,
            loops: true,
            unused: true,
            warnings: false,
            // Aggressive dead code elimination
            dead_code: true,
            conditionals: true,
            evaluate: true,
            drop_debugger: true,
            reduce_vars: true
          },
          mangle: {
            // Enhanced name mangling
            toplevel: true,
            safari10: true,
            properties: {
              // Be careful with this option as it might break functionality
              // Enable only if you're sure your code doesn't rely on property names
              // reserved: ['turndown', '$']
            }
          }
        },
        extractComments: true
      })
    ]
  },
  performance: {
    hints: false
  }
};