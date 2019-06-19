module.exports = {
  apps: [
    // {
    //   name: 'alleles',
    //   script: './server/index.js',
    //   // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    //   args: '',
    //   instances: 1,
    //   autorestart: true,
    //   watch: false,
    //   max_memory_restart: '1G',
    //   output: './logs/graphql-server.log',
    //   error: './logs/graphql-server.err',
    //   env: {
    //     NODE_ENV: 'development'
    //   },
    //   env_production: {
    //     NODE_ENV: 'production'
    //   }
    // },
    {
      name: 'postgraphile',
      script: './node_modules/.bin/postgraphile',
      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      args: '-c postgres:///FB2019_02 -s flybase,gene -a -j -M',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      output: './logs/chado-server.log',
      error: './logs/chado-server.err',
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
