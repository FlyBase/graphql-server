import { fetch } from 'cross-fetch'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

import {
  AllelesByGene,
  Allele,
  Alleles,
  InsertionsWithoutAllelesByGene,
} from './chado/queries.gql'

import {
  reformatAllele,
  reformatAlleles,
  reformatAlleleByGene,
  reformatInsertionByGene,
} from './chado/alleles'

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
    allelesByGene: async (
      obj,
      { fbgn, isConstruct = false, geneIsRegulatoryRegion = false },
      context,
      info_
    ) => {
      const result = await psqlClient
        .query({
          query: AllelesByGene,
          variables: {
            fbgn,
            isConstruct,
            geneIsRegulatoryRegion,
          },
        })
        .catch(e => console.error(e))
      return result.data.allGenes.nodes.length !== 0
        ? reformatAlleleByGene(result.data.allGenes.nodes[0])
        : null
    },
    insertionsWithoutAllelesByGene: async (obj, { fbgn }, context, info) => {
      const result = await psqlClient
        .query({
          query: InsertionsWithoutAllelesByGene,
          variables: {
            fbgn: fbgn,
          },
        })
        .catch(e => console.error(e))
      return result.data.allGenes.nodes.length !== 0
        ? reformatInsertionByGene(result.data.allGenes.nodes[0])
        : null
    },
    allele: async (obj, { fbal }, context, info) => {
      const result = await psqlClient
        .query({
          query: Allele,
          variables: { fbal },
        })
        .catch(e => console.error(e))
      return result.data.allAlleles.nodes.length !== 0
        ? reformatAllele(result.data.allAlleles.nodes[0])
        : null
    },
    alleles: async (obj, { fbal_ids }, context, info) => {
      const result = await psqlClient
        .query({
          query: Alleles,
          variables: { fbal_ids },
        })
        .catch(e => console.error(e))
      return result.data.allelesByFbal.nodes.length !== 0
        ? reformatAlleles(result.data.allelesByFbal.nodes)
        : null
    },
  },
}
