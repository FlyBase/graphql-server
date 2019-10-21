import fetch from 'cross-fetch'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

import AllelesByGene from './chado/AllelesByGene.gql'
import Allele from './chado/Allele.gql'
import Alleles from './chado/Alleles.gql'
import InsertionsWithoutAllelesByGene from './chado/InsertionsWithoutAllelesByGene.gql'

import {
  reformatAllele,
  reformatAlleles,
  reformatAlleleByGene,
  reformatInsertionByGene,
} from './chado/alleles'

const cache = new InMemoryCache()
const link = new HttpLink({
  uri: 'http://localhost:5000/graphql',
  fetch: fetch,
})
const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
}

export const psqlClient = new ApolloClient({ cache, link, defaultOptions })

/*
  The following resolvers map to available queries in the schema.graphql file.
  When called, each resolver calls GraphQL endpoints served by Postgraphile.
  The results from postgres are reformatted to fit the biological data model
  (modeled in the schema.graphql) and returned.
*/
export const resolvers = {
  /**
   * Need to resolve Union types from the GraphQL schema.  That is a single type
   * that can of one or more sub types.
   * see
   * https://www.apollographql.com/docs/apollo-server/features/unions-interfaces/#union-type
   */
  Result: {
    __resolveType(obj, context, info) {
      if (obj.expression_terms) {
        return 'ExpressionToolSearchResult'
      }
      return null
    },
  },
  Query: {
    allelesByGene: async (
      _obj,
      { fbgn, isConstruct = false, geneIsRegulatoryRegion = false },
      _context,
      _info_
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
    insertionsWithoutAllelesByGene: async (obj, { fbgn }, _context, _info) => {
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
    alleleById: async (_obj, { fbal }, _context, _info) => {
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
    allelesByIds: async (_obj, { fbal_ids }, _context, _info) => {
      console.log(`Fetching ${fbal_ids.length} alleles by IDs from Chado.`)
      const result = await psqlClient
        .query({
          query: Alleles,
          variables: { fbal_ids },
        })
        .catch(e => console.error(e))
      console.log('Retrieved alleles, reformatting results.')
      return result.data.allelesByFbal.nodes.length !== 0
        ? reformatAlleles(result.data.allelesByFbal.nodes)
        : null
    },
    searchExpressionTools: async (
      _obj,
      { expression, gene },
      { dataSources },
      _info
    ) => {
      console.log('Querying FlyBase API for expression tools.')
      try {
        if (gene && gene.length !== 0) {
          /**
           * Search by gene.
           */
          const data = await dataSources.flyBaseAPI.searchExpressionToolsByGene(
            {
              gene,
            }
          )
          return data.resultset.result
        } else if (
          expression &&
          typeof expression === 'object' &&
          Object.keys(expression).length > 0
        ) {
          /**
           * Search by expression
           */
          const data = await dataSources.flyBaseAPI.searchExpressionToolsByExpression(
            { expression }
          )
          console.log('Done querying, returning results.')
          return data.resultset.result
        }
      } catch (e) {
        console.error(e)
      }
      return null
    },
  },
}
