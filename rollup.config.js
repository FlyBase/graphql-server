// rollup.config.js
import babel from 'rollup-plugin-babel';
import graphql from '@kocal/rollup-plugin-graphql';

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
    'apollo-datasource-rest',
    'apollo-link-http',
    'graphql-tag',
    'lodash.pickby',
    'lodash.isplainobject',
    'lodash.mapkeys'
  ],
  plugins: [ 
    babel({
      exclude: 'node_modules/**', // only transpile our source code
    }),
    graphql()
  ]
};
