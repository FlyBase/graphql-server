module.exports = {
  apps: [
    {
      name: 'flybase-graphql',
      script: 'dist/bundle.js',
      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      args: '',
      node_args: '--max_old_space_size=2000',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '2G',
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
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      output: './logs/postgraphile.log',
      error: './logs/postgraphile.err',
      env: {
        NODE_ENV: 'development',
        args: '-s flybase,gene -j -M -l 5MB --timeout 60000',
      },
      env_production: {
        NODE_ENV: 'production',
        args: '-s flybase,gene -j -M -l 5MB --timeout 60000 --disable-query-log',
      }
    }
  ],
  deploy : {
    production : {},
    staging: {},
    development: {},
  }
};
