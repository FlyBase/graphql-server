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
      },
    },
    {
      name: 'postgraphile',
      script: './node_modules/.bin/postgraphile',
      // Options reference: http://pm2.keymetrics.io/docs/usage/application-declaration/
      args:
        '--subscriptions ' +
        '--retry-on-init-fail ' +
        '--dynamic-json ' +
        '--no-setof-functions-contain-nulls ' +
        '--no-ignore-rbac ' +
        '--no-ignore-indexes ' +
        '--extended-errors errcode ' +
        '--disable-default-mutations ' +
        '--body-size-limit 5MB ' +
        '--timeout 60000 ' +
        '--disable-query-log ' +
        '--legacy-relations omit ' +
        '--max-pool-size 100 ' +
        '--graphql "/chado-graphql" ' +
        '--graphiql "/chado-graphiql" ' +
        '--enhance-graphiql ' +
        '-s flybase,gene,gene_group,humanhealth',
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
