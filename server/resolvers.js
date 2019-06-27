import { fetch } from 'cross-fetch'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

import {
  ClassicalAndInsertionAllelesByGene,
  ClassicalAndInsertionAllelesByAllele,
  InsertionsWithoutAllelesByGene,
} from './chado/queries.graphql'

import {
  reformatAllele,
  reformatAlleleByGene,
  reformatInsertionByGene,
} from './chado/formatter/alleles'

export const cache = new InMemoryCache()
export const link = new HttpLink({
  uri: 'http://localhost:5000/graphql',
  fetch: fetch,
})

export const psqlClient = new ApolloClient({ cache, link })

/*
  The following resolvers map to available queries in the schema.graphql file.
  When called, each resolver calls GraphQL endpoints served by Postgraphile.
  The results from postgres are reformatted to fit the biological data model
  (modeled in the schema.graphql) and returned.
*/
export const resolvers = {
  Query: {
    classicalAndInsertionAllelesByGene: async (_, { fbgn }, ___, ____) => {
      const result = await psqlClient
        .query({
          query: ClassicalAndInsertionAllelesByGene,
          variables: {
            fbgn: fbgn,
          },
        })
        .catch(e => console.error(e))
      return result.data.allGenes.nodes.length != 0
        ? reformatAlleleByGene(result.data.allGenes.nodes[0])
        : null
    },
    insertionsWithoutAllelesByGene: async (_, { fbgn }, ___, ____) => {
      const result = await psqlClient
        .query({
          query: InsertionsWithoutAllelesByGene,
          variables: {
            fbgn: fbgn,
          },
        })
        .catch(e => console.error(e))
      return result.data.allGenes.nodes.length != 0
        ? reformatInsertionByGene(result.data.allGenes.nodes[0])
        : null
    },
    classicalAndInsertionAllelesByAllele: async (_, { fbal }, ___, ____) => {
      const result = await psqlClient
        .query({
          query: ClassicalAndInsertionAllelesByAllele,
          variables: {
            fbal: fbal,
          },
        })
        .catch(e => console.error(e))
      return result.data.allAlleles.nodes.length != 0
        ? reformatAllele(result.data.allAlleles.nodes[0])
        : null
    },
  },
}
