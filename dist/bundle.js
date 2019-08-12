'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('@babel/polyfill');
var apolloServer = require('apollo-server');
var crossFetch = require('cross-fetch');
var apolloClient = require('apollo-client');
var apolloCacheInmemory = require('apollo-cache-inmemory');
var apolloLinkHttp = require('apollo-link-http');
var pickBy = _interopDefault(require('lodash.pickby'));
var isPlainObject = _interopDefault(require('lodash.isplainobject'));
var mapKeys = _interopDefault(require('lodash.mapkeys'));
var apolloDatasourceRest = require('apollo-datasource-rest');

var doc = {"kind":"Document","definitions":[{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Gene"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"symbol"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"alleles"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Allele"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"insertions"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Insertion"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Allele"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"symbol"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"isConstruct"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"geneIsRegulatoryRegion"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"classes"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CVTerm"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"mutagens"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CVTerm"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"stocksCount"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"pubCount"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"knownLesion"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"constructs"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Construct"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"insertions"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Insertion"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"insertedElementTypes"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CVTerm"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"regRegions"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Tool"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"encodedTools"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Tool"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"encodedToolUses"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CVTerm"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"taggedWith"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Tool"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"tagUses"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CVTerm"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"alsoCarries"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Tool"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"CVTerm"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Insertion"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"symbol"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"insertedElementTypes"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CVTerm"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"regRegions"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Tool"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"encodedTools"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Tool"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"encodedToolUses"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CVTerm"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"taggedWith"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Tool"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"tagUses"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CVTerm"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"alsoCarries"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Tool"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"stocksCount"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"pubCount"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Construct"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"symbol"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Tool"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"symbol"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Stock"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"genotype"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"stockNumber"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"center"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ExpressionToolSearchResult"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"expression_terms"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CVTerm"}}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"ExpressionSearchInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"stage"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"anatomy"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"subcellular"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"UnionTypeDefinition","name":{"kind":"Name","value":"Result"},"directives":[],"types":[{"kind":"NamedType","name":{"kind":"Name","value":"ExpressionToolSearchResult"}}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"FlyBaseAPIResult"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"resultset"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ResultSet"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ResultSet"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"api_version"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"data_version"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"query_url"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"query_time"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"data_provider"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"result"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Result"}}}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Query"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"allelesByGene"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"fbgn"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"isConstruct"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"geneIsRegulatoryRegion"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Gene"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"alleleById"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"fbal"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Allele"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"allelesByIds"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"fbal_ids"},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},"directives":[]}],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Allele"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"insertionsWithoutAllelesByGene"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"fbgn"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Gene"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"searchExpressionTools"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"expression"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ExpressionSearchInput"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"gene"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExpressionToolSearchResult"}}},"directives":[]}]}],"loc":{"start":0,"end":1761}};
    doc.loc.source = {"body":"type Gene {\n  id: ID!\n  symbol: String\n  alleles: [Allele]\n  insertions: [Insertion]\n}\n\ntype Allele {\n  id: ID!\n  symbol: String\n  isConstruct: Boolean\n  geneIsRegulatoryRegion: Boolean\n  classes: [CVTerm]\n  mutagens: [CVTerm]\n  stocksCount: Int\n  pubCount: Int\n  knownLesion: Boolean\n  constructs: [Construct]\n  insertions: [Insertion]\n  insertedElementTypes: [CVTerm]\n  regRegions: [Tool]\n  encodedTools: [Tool]\n  encodedToolUses: [CVTerm]\n  taggedWith: [Tool]\n  tagUses: [CVTerm]\n  alsoCarries: [Tool]\n}\n\ntype CVTerm {\n  id: ID!\n  name: String!\n}\n\ntype Insertion {\n  id: ID!\n  symbol: String\n  insertedElementTypes: [CVTerm]\n  regRegions: [Tool]\n  encodedTools: [Tool]\n  encodedToolUses: [CVTerm]\n  taggedWith: [Tool]\n  tagUses: [CVTerm]\n  alsoCarries: [Tool]\n  stocksCount: Int\n  pubCount: Int\n}\n\ntype Construct {\n  id: ID!\n  symbol: String\n}\n\ntype Tool {\n  id: ID!\n  symbol: String\n}\n\ntype Stock {\n  id: ID!\n  genotype: String\n  stockNumber: String\n  center: String\n}\n\ntype ExpressionToolSearchResult {\n  id: ID!\n  expression_terms: [CVTerm]!\n}\n\ninput ExpressionSearchInput {\n  stage: String\n  anatomy: String\n  subcellular: String\n}\n\nunion Result = ExpressionToolSearchResult\n\ntype FlyBaseAPIResult {\n  resultset: ResultSet!\n}\n\ntype ResultSet {\n  api_version: String!\n  data_version: String!\n  query_url: String!\n  query_time: String!\n  data_provider: String!\n  result: [Result!]!\n}\n\ntype Query {\n  allelesByGene(\n    fbgn: String!\n    isConstruct: Boolean\n    geneIsRegulatoryRegion: Boolean\n  ): Gene\n  alleleById(fbal: String!): Allele\n  allelesByIds(fbal_ids: [String]!): [Allele]\n  insertionsWithoutAllelesByGene(fbgn: String!): Gene\n  searchExpressionTools(\n    expression: ExpressionSearchInput\n    gene: String\n  ): [ExpressionToolSearchResult]\n}\n","name":"GraphQL request","locationOffset":{"line":1,"column":1}};

var doc$1 = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllelesByGene"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fbgn"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isConstruct"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"defaultValue":{"kind":"BooleanValue","value":false},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"geneIsRegulatoryRegion"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"defaultValue":{"kind":"BooleanValue","value":false},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allGenes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"condition"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"uniquename"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fbgn"}}}]}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"uniquename"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"allelesByGeneId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"condition"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"isConstruct"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isConstruct"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"geneIsRegulatoryRegion"},"value":{"kind":"Variable","name":{"kind":"Name","value":"geneIsRegulatoryRegion"}}}]}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"alleleFields"},"directives":[]}]}}]}}]}}]}}]}},{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InsertionsWithoutAllelesByGene"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fbgn"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allGenes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"condition"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"uniquename"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fbgn"}}}]}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"uniquename"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"insertionsByGeneId"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fbtiId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"symbol"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"stocksCount"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"pubCount"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"constructsByInsertionId"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fbtpId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"symbol"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"toolUsesByConstructId"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"toolUses"},"directives":[]}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"toolsByConstructId"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"toolFields"},"directives":[]}]}}]}}]}}]}}]}}]}}]}}]}}]}},{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Allele"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fbal"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allAlleles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"condition"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"fbalId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fbal"}}}]}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"alleleFields"},"directives":[]}]}}]}}]}},{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Alleles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fbal_ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allelesByFbal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fbal_ids"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"alleleFields"},"directives":[]}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"alleleFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Allele"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"fbalId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"isConstruct"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"propagateTransgenicUses"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"geneIsRegulatoryRegion"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"stocksCount"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"pubCount"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"knownLesion"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"alleleClassesByAlleleId"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fbcvId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"alleleMutagensByAlleleId"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fbcvId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"insertionsByAlleleId"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fbtiId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"symbol"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"constructsByInsertionId"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fbtpId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"symbol"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"toolUsesByConstructId"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"toolUses"},"directives":[]}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"toolsByConstructId"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"toolFields"},"directives":[]}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"constructsByAlleleId"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fbtpId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"symbol"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"toolsByConstructId"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"toolFields"},"directives":[]}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"toolUsesByConstructId"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"toolUses"},"directives":[]}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"toolsByAlleleId"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"toolFields"},"directives":[]}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"toolUsesByAlleleId"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"toolUses"},"directives":[]}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"toolFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tool"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fbid"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"symbol"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"relType"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"toolUsesByToolId"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"toolUses"},"directives":[]}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"toolUses"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ToolUse"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fbcvId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]}]}}],"loc":{"start":0,"end":2573}};
    doc$1.loc.source = {"body":"query AllelesByGene(\n  $fbgn: String!\n  $isConstruct: Boolean = false\n  $geneIsRegulatoryRegion: Boolean = false\n) {\n  allGenes(condition: { uniquename: $fbgn }) {\n    nodes {\n      name\n      uniquename\n      allelesByGeneId(\n        condition: {\n          isConstruct: $isConstruct\n          geneIsRegulatoryRegion: $geneIsRegulatoryRegion\n        }\n      ) {\n        nodes {\n          ...alleleFields\n        }\n      }\n    }\n  }\n}\n\nquery InsertionsWithoutAllelesByGene($fbgn: String!) {\n  allGenes(condition: { uniquename: $fbgn }) {\n    nodes {\n      name\n      uniquename\n      insertionsByGeneId {\n        nodes {\n          fbtiId\n          symbol\n          stocksCount\n          pubCount\n          constructsByInsertionId {\n            nodes {\n              fbtpId\n              symbol\n              toolUsesByConstructId {\n                nodes {\n                  ...toolUses\n                }\n              }\n              toolsByConstructId {\n                nodes {\n                  ...toolFields\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nquery Allele($fbal: String!) {\n  allAlleles(condition: { fbalId: $fbal }) {\n    nodes {\n      ...alleleFields\n    }\n  }\n}\n\nquery Alleles($fbal_ids: [String]!) {\n  allelesByFbal(ids: $fbal_ids) {\n    nodes {\n      ...alleleFields\n    }\n  }\n}\n\nfragment alleleFields on Allele {\n  symbol\n  fbalId\n  isConstruct\n  propagateTransgenicUses\n  geneIsRegulatoryRegion\n  stocksCount\n  pubCount\n  knownLesion\n  alleleClassesByAlleleId {\n    nodes {\n      fbcvId\n      name\n    }\n  }\n  alleleMutagensByAlleleId {\n    nodes {\n      fbcvId\n      name\n    }\n  }\n  insertionsByAlleleId {\n    nodes {\n      fbtiId\n      symbol\n      constructsByInsertionId {\n        nodes {\n          fbtpId\n          symbol\n          toolUsesByConstructId {\n            nodes {\n              ...toolUses\n            }\n          }\n          toolsByConstructId {\n            nodes {\n              ...toolFields\n            }\n          }\n        }\n      }\n    }\n  }\n  constructsByAlleleId {\n    nodes {\n      fbtpId\n      symbol\n      toolsByConstructId {\n        nodes {\n          ...toolFields\n        }\n      }\n      toolUsesByConstructId {\n        nodes {\n          ...toolUses\n        }\n      }\n    }\n  }\n  toolsByAlleleId {\n    nodes {\n      ...toolFields\n    }\n  }\n  toolUsesByAlleleId {\n    nodes {\n      ...toolUses\n    }\n  }\n}\n\nfragment toolFields on Tool {\n  fbid\n  symbol\n  relType\n  toolUsesByToolId {\n    nodes {\n      ...toolUses\n    }\n  }\n}\n\nfragment toolUses on ToolUse {\n  fbcvId\n  name\n}\n","name":"GraphQL request","locationOffset":{"line":1,"column":1}};
  

    // Collect any fragment/type references from a node, adding them to the refs Set
    function collectFragmentReferences(node, refs) {
      if (node.kind === "FragmentSpread") {
        refs.add(node.name.value);
      } else if (node.kind === "VariableDefinition") {
        var type = node.type;
        if (type.kind === "NamedType") {
          refs.add(type.name.value);
        }
      }

      if (node.selectionSet) {
        node.selectionSet.selections.forEach(function(selection) {
          collectFragmentReferences(selection, refs);
        });
      }

      if (node.variableDefinitions) {
        node.variableDefinitions.forEach(function(def) {
          collectFragmentReferences(def, refs);
        });
      }

      if (node.definitions) {
        node.definitions.forEach(function(def) {
          collectFragmentReferences(def, refs);
        });
      }
    }

    var definitionRefs = {};
    (function extractReferences() {
      doc$1.definitions.forEach(function(def) {
        if (def.name) {
          var refs = new Set();
          collectFragmentReferences(def, refs);
          definitionRefs[def.name.value] = refs;
        }
      });
    })();

    function findOperation(doc, name) {
      for (var i = 0; i < doc.definitions.length; i++) {
        var element = doc.definitions[i];
        if (element.name && element.name.value == name) {
          return element;
        }
      }
    }

    function oneQuery(doc, operationName) {
      // Copy the DocumentNode, but clear out the definitions
      var newDoc = {
        kind: doc.kind,
        definitions: [findOperation(doc, operationName)]
      };
      if (doc.hasOwnProperty("loc")) {
        newDoc.loc = doc.loc;
      }

      // Now, for the operation we're running, find any fragments referenced by
      // it or the fragments it references
      var opRefs = definitionRefs[operationName] || new Set();
      var allRefs = new Set();
      var newRefs = new Set();

      // IE 11 doesn't support "new Set(iterable)", so we add the members of opRefs to newRefs one by one
      opRefs.forEach(function(refName) {
        newRefs.add(refName);
      });

      while (newRefs.size > 0) {
        var prevRefs = newRefs;
        newRefs = new Set();

        prevRefs.forEach(function(refName) {
          if (!allRefs.has(refName)) {
            allRefs.add(refName);
            var childRefs = definitionRefs[refName] || new Set();
            childRefs.forEach(function(childRef) {
              newRefs.add(childRef);
            });
          }
        });
      }

      allRefs.forEach(function(refName) {
        var op = findOperation(doc, refName);
        if (op) {
          newDoc.definitions.push(op);
        }
      });

      return newDoc;
    }
    
        const AllelesByGene = oneQuery(doc$1, "AllelesByGene");
        
        const InsertionsWithoutAllelesByGene = oneQuery(doc$1, "InsertionsWithoutAllelesByGene");
        
        const Allele = oneQuery(doc$1, "Allele");
        
        const Alleles = oneQuery(doc$1, "Alleles");

const reformatAlleleByGene = gene => {
  const alleles = flattenNodes(gene.allelesByGeneId.nodes);
  const {
    uniquename: id,
    name: symbol
  } = gene;
  return {
    id,
    symbol,
    alleles: alleles.map(allele => materializeTools(allele, {
      id,
      symbol
    }))
  };
};
const reformatAlleles = nodes => {
  const alleles = flattenNodes(nodes);
  return alleles.map(allele => materializeTools(allele));
};
const reformatInsertionByGene = gene => {
  const insertions = flattenNodes(gene.insertionsByGeneId.nodes);
  return {
    id: gene.uniquename,
    symbol: gene.name,
    insertions: insertions.map(insertion => materializeTools(insertion))
  };
};
const reformatAllele = allele => {
  const node = flattenNodes([allele])[0];
  return materializeTools(node);
};

const materializeTools = (fbObject = {}, parent = {}) => {
  /*
  Pull out attributes that we will need to process.
   The following uses object destructuring.
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Assigning_to_new_variable_names
  */
  const {
    id,
    propagateTransgenicUses = true,
    stocksCount = 0,
    knownLesion = false,
    insertions = [],
    constructs = [],
    toolUses = [],
    ...restProps
  } = fbObject;
  const isAllele = /^FBal\d+$/.test(id); // Pull data from construct if we are supposed to.

  if (propagateTransgenicUses) {
    toolUses.push(...getInsertedElementTypes(insertions, constructs));
  }

  const encodedTools = getTools(fbObject, 'encodes_tool', propagateTransgenicUses);

  if (fbObject.isConstruct && encodedTools.length === 0 && parent && parent.id) {
    const isGene = /^FBgn\d+$/.test(parent.id);
    if (isGene) encodedTools.push(parent);
  }

  const taggedWith = getTools(fbObject, 'tagged_with', propagateTransgenicUses);
  const materializedFbObject = { ...restProps,
    id,
    stocksCount,
    knownLesion,
    insertions,
    constructs,
    insertedElementTypes: toolUses,
    regRegions: getTools(fbObject, 'has_reg_region', propagateTransgenicUses),
    encodedTools,
    encodedToolUses: getToolUses(encodedTools),
    taggedWith,
    tagUses: getToolUses(taggedWith),
    alsoCarries: getTools(fbObject, 'carries_tool', propagateTransgenicUses)
  };

  if (!isAllele) {
    // Delete these fields if record is not an allele.
    delete materializedFbObject.isConstruct;
    delete materializedFbObject.knownLesion;
    delete materializedFbObject.classes;
    delete materializedFbObject.mutagens;
    delete materializedFbObject.geneIsRegulatoryRegion;
  } else {
    if (materializedFbObject.isConstruct) {
      // Delete insertion related fields for construct alleles.
      delete materializedFbObject.insertions;
      delete materializedFbObject.insertedElementTypes;
    } else {
      // Delete constructs field for classical/insertion alleles.
      delete materializedFbObject.constructs;
    }
  }

  return materializedFbObject;
};

const getInsertedElementTypes = (insertions = [], constructs = []) => {
  // Get tool uses attached to allele->insertion->construct
  const insertionToolUses = insertions.reduce((accum, insertion) => {
    insertion.constructs.forEach(construct => {
      accum.push(...construct.toolUses);
    });
    return accum;
  }, []); // Get tool uses attached to allele->constructs or insertion->construct

  const constructToolUses = constructs.reduce((accum, construct) => {
    return [...accum, ...construct.toolUses];
  }, []);
  return [...insertionToolUses, ...constructToolUses];
};

const getTools = (object, relType, propagateTransgenicUses = false) => {
  const tools = object.tools ? object.tools.filter(tool => tool.relType === relType) : [];

  if (propagateTransgenicUses) {
    let toolObjectParents = [];

    if (object.insertions) {
      toolObjectParents = object.insertions;
    } else if (object.constructs) {
      toolObjectParents = object.constructs;
    } // Get tool uses attached to allele->insertion->construct


    const constructTools = toolObjectParents.reduce((accum, parent) => {
      if (parent.tools) {
        accum.push(...parent.tools.filter(tool => tool.relType === relType));
      }

      if (parent.constructs) {
        parent.constructs.forEach(construct => {
          // Collect all Encoded tools from the construct
          accum.push(...construct.tools.filter(tool => tool.relType === relType));
        });
      }

      return accum;
    }, []);
    tools.push(...constructTools);
  }

  return tools;
};

const getToolUses = (tools = []) => {
  return tools.reduce((accum, tool) => {
    if (tool.toolUses && tool.toolUses.length !== 0) {
      accum.push(...tool.toolUses);
    }

    return accum;
  }, []);
};
/*
Function that takes a field name from a Chado
Postgraphile GraphQL response and maps it to a simpler
biologist friendly name.
*/


const getSubFieldName = name => {
  switch (name) {
    case 'allelesByGeneId':
      return 'alleles';

    case 'alleleClassesByAlleleId':
      return 'classes';

    case 'alleleMutagensByAlleleId':
      return 'mutagens';

    case 'insertionsByGeneId':
    case 'insertionsByAlleleId':
      return 'insertions';

    case 'constructsByInsertionId':
    case 'constructsByAlleleId':
      return 'constructs';

    case 'toolsByConstructId':
    case 'toolsByAlleleId':
      return 'tools';

    case 'toolUsesByToolId':
    case 'toolUsesByAlleleId':
    case 'toolUsesByConstructId':
      return 'toolUses';

    default:
      return name;
  }
};

const remapFbIdKey = key => {
  if (/^fb\w\wId$/.test(key)) {
    return 'id';
  } else if (/^fbid$/.test(key)) {
    return 'id';
  }

  return key;
};

const flattenNodes = (nodes = []) => {
  return nodes.map(node => {
    /* Extract fields that have scalar values and also remap fields with 
       names like 'fbtpId' to 'id'.  PickBy takes an object and returns 
       a new object with fields for which the function passed in returns true.
       mapKeys takes the resulting object from PickBy and remaps the key names
       based on the function passed to it.
        Also removes the __typename attribute, which will be added back in
       by the next GraphSQL response.
       
       pickBy  - https://lodash.com/docs#pickBy
       mapKeys - https://lodash.com/docs#mapKeys
    */
    const nodeObject = mapKeys(pickBy(node, (val, key) => key !== '__typename' && !isPlainObject(val)), (value, key) => remapFbIdKey(key)); // Extract object type fields.

    const subObjects = pickBy(node, val => isPlainObject(val)); // Recurse through the sub object fields.

    Object.keys(subObjects).forEach(subField => {
      // Check if sub field has a 'nodes' property
      if (subObjects[subField].nodes) {
        nodeObject[getSubFieldName(subField)] = flattenNodes(subObjects[subField].nodes);
      }
    });
    return nodeObject;
  });
};

const cache = new apolloCacheInmemory.InMemoryCache();
const link = new apolloLinkHttp.HttpLink({
  uri: 'http://localhost:5000/graphql',
  fetch: crossFetch.fetch
});
const psqlClient = new apolloClient.ApolloClient({
  cache,
  link
});
/*
  The following resolvers map to available queries in the schema.graphql file.
  When called, each resolver calls GraphQL endpoints served by Postgraphile.
  The results from postgres are reformatted to fit the biological data model
  (modeled in the schema.graphql) and returned.
*/

const resolvers = {
  /**
   * Need to resolve Union types from the GraphQL schema.  That is a single type
   * that can of one or more sub types.
   * see
   * https://www.apollographql.com/docs/apollo-server/features/unions-interfaces/#union-type
   */
  Result: {
    __resolveType(obj, context, info) {
      if (obj.expression_terms) {
        return 'ExpressionToolSearchResult';
      }

      return null;
    }

  },
  Query: {
    allelesByGene: async (_obj, {
      fbgn,
      isConstruct = false,
      geneIsRegulatoryRegion = false
    }, _context, _info_) => {
      const result = await psqlClient.query({
        query: AllelesByGene,
        variables: {
          fbgn,
          isConstruct,
          geneIsRegulatoryRegion
        }
      }).catch(e => console.error(e));
      return result.data.allGenes.nodes.length !== 0 ? reformatAlleleByGene(result.data.allGenes.nodes[0]) : null;
    },
    insertionsWithoutAllelesByGene: async (obj, {
      fbgn
    }, _context, _info) => {
      const result = await psqlClient.query({
        query: InsertionsWithoutAllelesByGene,
        variables: {
          fbgn: fbgn
        }
      }).catch(e => console.error(e));
      return result.data.allGenes.nodes.length !== 0 ? reformatInsertionByGene(result.data.allGenes.nodes[0]) : null;
    },
    alleleById: async (_obj, {
      fbal
    }, _context, _info) => {
      const result = await psqlClient.query({
        query: Allele,
        variables: {
          fbal
        }
      }).catch(e => console.error(e));
      return result.data.allAlleles.nodes.length !== 0 ? reformatAllele(result.data.allAlleles.nodes[0]) : null;
    },
    allelesByIds: async (_obj, {
      fbal_ids
    }, _context, _info) => {
      const result = await psqlClient.query({
        query: Alleles,
        variables: {
          fbal_ids
        }
      }).catch(e => console.error(e));
      return result.data.allelesByFbal.nodes.length !== 0 ? reformatAlleles(result.data.allelesByFbal.nodes) : null;
    },
    searchExpressionTools: async (_obj, {
      expression,
      gene
    }, {
      dataSources
    }, _info) => {
      try {
        if (gene && gene.length !== 0) {
          const data = await dataSources.flyBaseAPI.searchExpressionToolsByGene({
            gene
          });
          return data.resultset.result;
        } else if (expression && typeof expression === 'object' && Object.keys(expression).length > 0) {
          const data = await dataSources.flyBaseAPI.searchExpressionToolsByExpression({
            expression
          });
          return data.resultset.result;
        }
      } catch (e) {
        console.error(e);
      }

      return [];
    }
  }
};

/**
 * An Apollo REST data source for using the FlyBase API
 */

class FlyBaseAPI extends apolloDatasourceRest.RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://localhost:7082/api/';
  }

  async searchExpressionToolsByGene({
    gene
  }) {
    return this.get('/expression/tools', {
      gene
    });
  }

  async searchExpressionToolsByExpression({
    expression
  }) {
    return this.get('/expression/tools', { ...expression
    });
  }

}

/*
 Required due to a RegeneratorRuntime error being thrown.
 see https://stackoverflow.com/a/54490329
*/

const server = new apolloServer.ApolloServer({
  typeDefs: doc,
  resolvers,
  dataSources: () => {
    return {
      flyBaseAPI: new FlyBaseAPI()
    };
  }
}); // Start it up!

server.listen().then(({
  url
}) => {
  console.log(`🚀  Server ready at ${url}`);
});
