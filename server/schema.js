const { gql } = require('apollo-server');

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`

  type Gene {
    id: ID!
    symbol: String
    alleles: [Allele]
  }

  type Allele {
    id: ID!
    symbol: String
  }

  type Query {
    gene(id: ID!): Gene
  }
`;

module.exports = typeDefs;