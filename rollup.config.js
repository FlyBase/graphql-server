// rollup.config.js
import babel from 'rollup-plugin-babel';

export default {
  input: 'server/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs',
  },
  external: [
    'cross-fetch',
    '@babel/polyfill',
    'apollo-server',
    'apollo-client',
    'apollo-cache-inmemory',
    'apollo-link-http',
    'graphql-tag',
  ],
  plugins: [ 
    babel({
      exclude: 'node_modules/**', // only transpile our source code
    })
  ]
};
