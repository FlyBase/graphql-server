module.exports = {
  apps: [
    {
      name: 'federation-layer',
      script: 'dist/federation.js',
      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      args: '',
      node_args: '--max_old_space_size=2000',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '2G',
      output: './logs/federation.log',
      error: './logs/federation.err',
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
