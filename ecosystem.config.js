module.exports = {
  apps: [
    {
      name: 'flybase-graphql',
      script: 'dist/tools.js',
      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      args: '',
      node_args: '--max_old_space_size=2000',
      instances: 3,
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
      },
    },
    {
      name: 'postgraphile',
      script: './node_modules/.bin/postgraphile',
      // Options reference: http://pm2.keymetrics.io/docs/usage/application-declaration/
      args:
        '-s flybase,gene,gene_group -j -M -l 5MB --timeout 60000 --append-plugins @graphile/federation --disable-query-log --enhance-graphiql --dynamic-json --legacy-relations omit --no-setof-functions-contain-nulls --max-pool-size 100',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      output: './logs/postgraphile.log',
      error: './logs/postgraphile.err',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
  deploy: {
    production: {},
    staging: {},
    development: {},
  },
}
