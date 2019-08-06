module.exports = {
  apps: [
    {
      name: 'flybase-graphql',
      script: 'dist/bundle.js',
      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      args: '',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      output: './logs/flybase-graphql.log',
      error: './logs/flybase-graphql.err',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      }
    },
    {
      name: 'postgraphile',
      script: './node_modules/.bin/postgraphile',
      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      args: '-s flybase,gene -a -j -M',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      output: './logs/postgraphile.log',
      error: './logs/postgraphile.err',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ],
  deploy : {
    production : {},
    staging: {},
    development: {},
  }
};
