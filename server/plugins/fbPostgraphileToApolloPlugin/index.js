import pg from 'pg'
import { makeSchemaAndPlugin } from 'postgraphile-apollo-server';
import PgSimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector';
import FBInflectorsPlugin from "./fbInflectorPlugin";
import exportPostGraphileSchema from 'postgraphile/build/postgraphile/schema/exportPostGraphileSchema';
import FBToolSummariesPlugin from "./toolSummariesPlugin";
import PgManyToManyPlugin from '@graphile-contrib/pg-many-to-many'
import { PgNodeAliasPostGraphile } from 'graphile-build-pg'

/*
* This code generates an Apollo Server plugin, giving Apollo access to everything
* within postgraphile. The "postgraphile-apollo-server" library creates the schema
* object and apollo plugin itself. You can also pass several options to the
* makeSchemaAndPlugin function. These options are the same described in the postgraphile
* documentation. Some options do nopt work with this library, though at the time of
* writing, there is no documented list of which options do not work.
* */

module.exports = async () => {
  const pgPool = new pg.Pool({
    max: 100 // Limits the concurrent number of connections to the DB. (We will likely never come close to all 100)
  });

  /*
  * Unless provided as an option here, postgraphile will use the default values
  * for PGDATABASE, PGUSER, and PGPASSWORD. This is usually set on our development
  * servers, but can be passed in the command line like so:
  *
  * PGDATABASE=FB20XX_XX PGUSER=argosadm PGPASSWORD=passwordHere123 command --here ...
  * */
  const { schema, plugin } = await makeSchemaAndPlugin(
    pgPool,
    ['flybase', 'gene', 'gene_group', 'humanhealth', 'dataclass', 'dataclass_relationship'], // All postgresQL schemas available to postgraphile
    {
      subscriptions: true,
      retryOnInitFail: true, //TODO: (error, numAttempts) => bool [limit number of retries]
      dynamicJson: true,
      setofFunctionsContainNulls: false,
      ignoreRBAC: false,
      ignoreIndexes: false,
      extendedErrors: ['errcode'],
      disableDefaultMutations: true,
      bodySizeLimit: '5MB',
      timeout: 60000,
      disableQueryLog: true,
      legacyRelations: 'omit',
      // This is where Postgraphile plugins go.
      appendPlugins: [
        PgManyToManyPlugin,
        PgSimplifyInflectorPlugin, //Simplifies the naming of queries and fields
        FBInflectorsPlugin, //Additional FB-specific naming changes
        FBToolSummariesPlugin //Adds various derived fields to Alleles and Insertions based on Tools and ToolUses
      ],
      simpleCollections: "both",
      graphileBuildOptions: {
        pgOmitListSuffix: true
      },
      skipPlugins: [PgNodeAliasPostGraphile]
    }
  );

  /*
  * Replicated the behavior of the "exportGqlSchemaPath" option within postgraphile.
  * For some reason, this does not work when using the library above (even though the code
  * looks like it should work).
  *
  * NOTE: This generated file is not currently in use. It is simply useful to have access
  * to the schema while developing for reference, and for your IDE to reference when
  * looking at type extensions and other IDE "do-it-for-you" sort of things.
  * */
  await exportPostGraphileSchema(schema, {
    exportGqlSchemaPath: `${__dirname}/../server/plugins/fbPostgraphileToApolloPlugin/postgraphileGeneratedSchema.graphql`
  });

  // Renaming here to avoid confusion since there are like 3 different meanings to "plugin"
  return { postgraphileSchema: schema, postgraphileToApolloPlugin: plugin };
}
