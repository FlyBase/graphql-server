import { ApolloServer, makeExecutableSchema, mergeSchemas } from 'apollo-server'
import * as Sentry from '@sentry/node'
import pg from 'pg'
import { makeSchemaAndPlugin } from 'postgraphile-apollo-server'
import { makeWrapResolversPlugin } from 'graphile-utils'

/*
Import the schema and resolvers for this GraphQL server.
In GraphSQL speak, resolvers are the functions that perform
the query and return results formatted according to the schema
*/
// import typeDefs from './schema-test.gql'
// import { resolvers } from './resolvers'
import FlyBaseAPI from './datasources/FlyBaseAPI'
import AllianceAPI from './datasources/AllianceAPI'

Sentry.init({
  dsn: 'https://a44fd5f15e834e20a0770d626e0e25c5@sentry.io/1788453',
})

const pgPool = new pg.Pool()

const main = async () => {
  const { schema, plugin } = await makeSchemaAndPlugin(
    pgPool,
    ['flybase', 'gene', 'gene_group', 'humanhealth'],
    {}
  )

  const postgraphileWrapResolversPlugin = makeWrapResolversPlugin({
    Query: {
      alleleById: async (resolve, source, args, context, resolveInfo) => {
        const result = await resolve();
        console.log("===RESOLVE===\n", result);
        return result;
      }
    }
  });

  // Create a new GraphQL server
  const server = new ApolloServer({
    //    typeDefs,
    //    resolvers,
    // Allow query introspection.
    introspection: true,
    // Turn on GraphQL playground
    playground: true,
    formatError: (err) => {
      Sentry.captureException(err)
      return err
    },
    dataSources: () => {
      return {
        flyBaseAPI: new FlyBaseAPI(),
        allianceAPI: new AllianceAPI(),
      }
    },
    schema: mergeSchemas({
      schemas: [schema],
      // resolvers: {
      //   Allele:  (parent, args, context, info) => {
      //     console.log("===PARENT===\n", parent);
      //     console.log("===ARGS===\n", args);
      //     console.log("===CONTEXT===\n", context);
      //     console.log("===INFO===\n", info);
      //     return parent;
      //   }
      // }
      // ...makeExecutableSchema({ typeDefs, resolvers }),
    }),
    plugins: [plugin, postgraphileWrapResolversPlugin],
  })

  // Start it up!
  server.listen().then(({ url }) => {
    console.log(`   Server ready at ${url}`)
  })
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
