import '@babel/polyfill'

import { fetch } from 'cross-fetch'
import { ApolloServer } from 'apollo-server'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

import typeDefs from './schema'

import alleleQuery from './queries/alleles'

console.log('Initializing client cache and link.')
const cache = new InMemoryCache()
const link = new HttpLink({
  uri: 'http://localhost:5000/graphql',
  fetch: fetch,
})

const psqlClient = new ApolloClient({ cache, link })

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    gene: async (_, { id }, ___, ____) => {
      const result = await psqlClient
        .query({
          query: alleleQuery,
          variables: {
            fbid: id,
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
  },
}

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers })

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
