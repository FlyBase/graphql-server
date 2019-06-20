import { fetch } from 'cross-fetch'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

import {
  ClassicalAndInsertionAllelesByGene,
  ClassicalAndInsertionAllelesByAllele,
} from './chado/alleles.graphql'

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
      const gene = result.data.allGenes.nodes[0]
      return {
        id: gene.uniquename,
        symbol: gene.name,
        alleles: gene.allelesByGeneId.nodes.map(allele => ({
          id: allele.fbalId,
          symbol: allele.symbol,
        })),
      }
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
