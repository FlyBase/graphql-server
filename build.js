const esbuild = require('esbuild')
const loader = require('@luckycatfactory/esbuild-graphql-loader').default
//const yargs = require('yargs/yargs')
//const { hideBin } = require('yargs/helpers')
//const argv = yargs(hideBin(process.argv)).argv

esbuild
  .build({
    entryPoints: ['server/index.js'],
    platform: 'node',
    watch: false/* argv.watch */,
    bundle: true,
    target: 'node10.24.0',
    outfile: 'dist/bundle.js',
    external: ['express'],
    plugins: [
      loader({
        filterRegex: /\.gql$/,
      }),
    ],
  })
  .catch((e) => {
    console.error(e.message)
    process.exit(1)
  })
