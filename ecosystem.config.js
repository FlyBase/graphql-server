module.exports = {
  apps: [
    {
      name: 'flybase-graphql',
      script: 'dist/bundle.js',
      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      args: '',
      node_args: ['--max_old_space_size=2000'],
      instances: 3,
      autorestart: true,
      watch: ['dist'],
      watch_delay: 1000,
      max_memory_restart: '2G',
      output: './logs/flybase-graphql.log',
      error: './logs/flybase-graphql.err',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
        DEBUG: 'graphile-build-pg:warn'
      },
    }
  ],
  deploy: {
    production: {},
    staging: {},
    development: {},
  },
}
