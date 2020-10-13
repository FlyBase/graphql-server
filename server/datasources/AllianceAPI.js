import { RESTDataSource } from 'apollo-datasource-rest'

/**
 * An Apollo REST data source for using the Alliance API
 */
class AllianceAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = 'https://www.alliancegenome.org/api/'
  }

  /**
   * Private static method to reformat Alliance parameters from their GraphQL
   * name into the expected REST API name. GraphQL field names do not
   * allow for '.' in them so they use '_' instead.
   *
   * @param params - A flat object representing the endpoint parameters
   * @returns {Object} - Copy of the params object with key names transformed.
   * @private
   */
  static _reformatParamKeys(params = {}) {
    const allianceParams = {}
    for (const [key, value] of Object.entries(params)) {
      allianceParams[key.replace('_', '.')] = value
    }
    return allianceParams
  }

  async getAllelesByGene({ id, params }) {
    return this.get(
      `/gene/FB:${id}/alleles`,
      AllianceAPI._reformatParamKeys(params)
    )
  }

  async getVariantsByAllele({ id, params }) {
    return this.get(
      `/allele/FB:${id}/variants`,
      AllianceAPI._reformatParamKeys(params)
    )
  }
}

export default AllianceAPI
