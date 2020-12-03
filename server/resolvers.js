import fetch from 'cross-fetch'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { ApolloError } from 'apollo-server'

import AllelesByGene from './chado/AllelesByGene.gql'
import Allele from './chado/Allele.gql'
import Alleles from './chado/Alleles.gql'
import InsertionsWithoutAllelesByGene from './chado/InsertionsWithoutAllelesByGene.gql'

// Functions for reformatting Chado GraphQL results
import {
  reformatAllele,
  reformatAlleles,
  reformatAlleleByGene,
  reformatInsertionByGene,
} from './chado/alleles'

// Error codes.
import { CHADO_QUERY_ERROR } from './constants'

// Set Apollo client dependencies and cache policies.
const cache = new InMemoryCache()
const link = new HttpLink({
  uri: 'http://localhost:5000/chado-graphql',
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
// Initialize the client that we will use to query the Chado GraphQL endpoint.
export const psqlClient = new ApolloClient({ cache, link, defaultOptions })

/**
 * Error handler for GraphQL resolvers.
 * This code attempts to trap failures that happen at upstream GraphQL servers
 * and rethrow them as wrapped ApolloError objects.
 *
 * see https://www.apollographql.com/docs/apollo-server/data/errors/
 *
 * @param err Error object thrown by ApolloClient when contacting upstream GraphQL servers.
 * @param code Code for the error.
 * @param additionalProperties
 */
export const handleError = (err, code = null, additionalProperties = null) => {
  if (
    err.networkError &&
    err.networkError.result &&
    err.networkError.result.errors
  ) {
    throw new ApolloError(
      err.networkError.result.errors.map(e => e.message).join(' '),
      code,
      additionalProperties
    )
  }
  throw err
}

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
  // Query resolvers.
  Query: {
    // Query Chado for all alleles by gene and reformat result.
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
        .catch(err => handleError(err, CHADO_QUERY_ERROR, { clientError: err }))

      return result &&
        result.data &&
        result.data.allGenes &&
        result.data.allGenes.nodes &&
        result.data.allGenes.nodes.length !== 0
        ? reformatAlleleByGene(result.data.allGenes.nodes[0])
        : null
    },
    // Query for insertions associated with a gene but no alleles.
    insertionsWithoutAllelesByGene: async (obj, { fbgn }, _context, _info) => {
      const result = await psqlClient
        .query({
          query: InsertionsWithoutAllelesByGene,
          variables: { fbgn },
        })
        .catch(err => handleError(err, CHADO_QUERY_ERROR, { clientError: err }))
      return result &&
        result.data &&
        result.data.allGenes &&
        result.data.allGenes.nodes &&
        result.data.allGenes.nodes.length !== 0
        ? reformatInsertionByGene(result.data.allGenes.nodes[0])
        : null
    },
    // Query for an allele by ID.
    alleleById: async (_obj, { fbal }, _context, _info) => {
      const result = await psqlClient
        .query({
          query: Allele,
          variables: { fbal },
        })
        .catch(err => handleError(err, CHADO_QUERY_ERROR, { clientError: err }))
      return result &&
        result.data &&
        result.data.allAlleles &&
        result.data.allAlleles.nodes &&
        result.data.allAlleles.nodes.length !== 0
        ? reformatAllele(result.data.allAlleles.nodes[0])
        : null
    },
    // Query for multiple alleles by ID.
    allelesByIds: async (_obj, { fbal_ids }, _context, _info) => {
      console.log(`Fetching ${fbal_ids.length} alleles by IDs from Chado.`)
      const result = await psqlClient
        .query({
          query: Alleles,
          variables: { fbal_ids },
        })
        .catch(err => handleError(err, CHADO_QUERY_ERROR, { clientError: err }))
      console.log('Retrieved alleles, reformatting results.')
      return result &&
        result.data &&
        result.data.allelesByFbal &&
        result.data.allelesByFbal.nodes &&
        result.data.allelesByFbal.nodes.length !== 0
        ? reformatAlleles(result.data.allelesByFbal.nodes)
        : null
    },
    // Search expression tools using the REST endpoint datasource.
    searchExpressionTools: async (
      _obj,
      { expression, gene },
      { dataSources },
      _info
    ) => {
      console.log('Querying FlyBase API for expression tools.')
      if (gene && gene.length !== 0) {
        /**
         * Search by gene.
         */
        const data = await dataSources.flyBaseAPI.searchExpressionToolsByGene({
          gene,
        })
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
      return null
    },
    getAllianceVariantsByGene: async (
      _obj,
      { id, params },
      { dataSources },
      _info
    ) => {
      const { results = [] } = await dataSources?.allianceAPI.getAllelesByGene({
        id,
        params,
      })
      const alleles = results
        .filter(({ variants = [] }) => variants.length !== 0)
        .map(({ id, symbol, synonyms, category, variants }) => ({
          id,
          symbol,
          synonyms,
          category,
          variants,
        }))
      return { alleles }
    },
    getAllianceVariantsByAllele: async (
      _obj,
      { id, ...params },
      { dataSources },
      _info
    ) => {
      const {
        results: variants = [],
      } = await dataSources?.allianceAPI.getVariantsByAllele({
        id,
        ...params,
      })
      return { variants }
    },
  },
}
