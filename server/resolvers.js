import { fetch } from 'cross-fetch'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

import {
  ClassicalAndInsertionAllelesByGene,
  ClassicalAndInsertionAllelesByAllele,
} from './chado/queries.graphql'

import { reformatGene } from './chado/formatter/alleles'

export const cache = new InMemoryCache()
export const link = new HttpLink({
  uri: 'http://localhost:5000/graphql',
  fetch: fetch,
})

export const psqlClient = new ApolloClient({ cache, link })

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
      return reformatGene(result.data.allGenes.nodes[0])
    },
    classicalAndInsertionAllelesByAllele: async (_, { fbal }, ___, ____) => {
      const result = await psqlClient.query({
        query: ClassicalAndInsertionAllelesByAllele,
        variables: {
          fbal: fbal,
        },
      })
      console.log(result)
      const allele = result.data.allAlleles.nodes[0]
      return { id: allele.fbalId, symbol: allele.symbol }
    },
  },
}
