import {
  ApolloServer,
  makeExecutableSchema,
  mergeSchemas,
} from 'apollo-server'
import * as Sentry from '@sentry/node'
import AllianceTypeExtensions from "./plugins/allianceExtensions/allianceTypeExtensions.graphql";
import FlyBaseAPI from './datasources/FlyBaseAPI';
import AllianceAPI from './datasources/AllianceAPI';
import FBPostgraphileToApolloPlugin from './plugins/fbPostgraphileToApolloPlugin';
import AllianceExtensionResolvers from './plugins/allianceExtensions/allianceExtensionResolvers'

Sentry.init({
  dsn: 'https://a44fd5f15e834e20a0770d626e0e25c5@sentry.io/1788453',
});

const main = async () => {

  const allianceSchema = makeExecutableSchema({
    typeDefs: AllianceTypeExtensions,
    resolvers: AllianceExtensionResolvers
  });

  /*
    Generates a gql schema and apollo plugin allowing the apollo server
    to utilize postgraphile's features.
   */
  const { postgraphileSchema, postgraphileToApolloPlugin } = await FBPostgraphileToApolloPlugin();

  const server = new ApolloServer({
    introspection: true,
    playground: true,
    formatError: (err) => {
      Sentry.captureException(err);
      return err;
    },
    //Supplies Apollo resolvers ONLY with access to make API calls
    dataSources: () => ({
      flyBaseAPI: new FlyBaseAPI(),
      allianceAPI: new AllianceAPI(),
    }),
    schema: mergeSchemas({
      schemas: [allianceSchema, postgraphileSchema],
      mergeDirectives: true //required for even @skip and @include to work
    }),
    // This is where plugins for Apollo Server go
    // Postgraphile plugins go in fbPostgraphileToApolloPlugin.js
    plugins: [postgraphileToApolloPlugin],
  });

  server.listen().then(({ url }) => {
    console.log(`   Server ready at ${url}`)
  })
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
