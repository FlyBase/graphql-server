const { makeAddPgTableConditionPlugin } = require('graphile-utils');
// Match the existing gene-group UI's strict score > 2 filter in SQL.
module.exports = makeAddPgTableConditionPlugin(
  'dataclass_relationship', 'gene_human_orthologv2', 'geneGroupMinimumDioptScore',
  build => ({ type: build.graphql.GraphQLInt, description: 'Return ortholog relationships with score strictly greater than this value.' }),
  (value, {sql, sqlTableAlias}) => value == null ? null : sql.fragment`${sqlTableAlias}.diopt_score > ${sql.value(value)}`
);
