import { makeExecutableSchema, mergeSchemas } from 'apollo-server'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { createGal4OperationBoundary, gal4HttpBoundary, gal4BodyBoundary, gal4JsonErrorBoundary } from './plugins/gal4OperationBoundary'
import gal4Documents from './plugins/gal4OperationBoundary/approved-documents.json'
import AllianceTypeExtensions from "./plugins/allianceExtensions/allianceTypeExtensions.graphql";
import FlyBaseAPI from './datasources/FlyBaseAPI';
import AllianceAPI from './datasources/AllianceAPI';
import FBPostgraphileToApolloPlugin from './plugins/fbPostgraphileToApolloPlugin';
import AllianceExtensionResolvers from './plugins/allianceExtensions/allianceExtensionResolvers'
import ErrorLoggingPlugin from './plugins/errorLogging';
import { fiveXXLogger, emptyBodyGuard } from './plugins/errorLogging/httpErrorMiddleware';

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
    introspection: false,
    playground: false,
    debug: false,
    // (Removed the dead Sentry init + formatError->Sentry.captureException — the DSN
    //  sentry.io/1788453 was an abandoned ~2020 project. Error capture is now on-box
    //  via the ErrorLoggingPlugin (didEncounterErrors) + the fiveXXLogger middleware.)
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
    plugins: [createGal4OperationBoundary(gal4Documents), postgraphileToApolloPlugin, ErrorLoggingPlugin],
  });

  // Express mode (apollo-server-express): lets us add HTTP-layer middleware in front
  // of Apollo — a 5xx logger and a guard that cleanly 400s the empty/bad-content-type
  // POSTs that the old standalone server returned 500 for ("POST body missing...").
  await server.start();

  const app = express();
  app.set('query parser', false); // JSON POST only; do not invoke vulnerable legacy qs.
  app.use(fiveXXLogger);    // log any 5xx (incl. residual the guard doesn't cover)
  app.use(gal4HttpBoundary);
  app.use(express.json()); // Retain the existing body-parser default (100kb).
  app.use(gal4JsonErrorBoundary);
  app.use(gal4BodyBoundary);
  app.use(emptyBodyGuard);  // empty/bad-body POST -> clean 400 (was 500)

  // Apache proxies public /graphql -> http://localhost:4000/ (root), so serve at '/',
  // NOT applyMiddleware's '/graphql' default — otherwise all GraphQL would 404.
  server.applyMiddleware({ app, path: '/' });

  app.listen(4000, () => {
    console.log(`   Server ready at http://localhost:4000${server.graphqlPath}`)
  })
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
