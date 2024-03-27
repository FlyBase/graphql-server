const resolvers = {
  Query: {
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
        const data =
          await dataSources.flyBaseAPI.searchExpressionToolsByExpression({
            expression,
          })
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
        .map(
          ({
             id,
             symbol,
             synonyms,
             category,
             hasDisease = false,
             hasPhenotype = false,
             variants,
           }) => ({
            id,
            symbol,
            synonyms,
            category,
            hasDisease,
            hasPhenotype,
            variants,
          })
        )
      return { alleles }
    },
    getAllianceVariantsByAllele: async (
      _obj,
      { id, ...params },
      { dataSources },
      _info
    ) => {
      const { results: variants = [] } =
        await dataSources?.allianceAPI.getVariantsByAllele({
          id,
          ...params,
        })
      return { variants }
    },
  }
};
export default resolvers;