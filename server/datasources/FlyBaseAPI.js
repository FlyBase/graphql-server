import { RESTDataSource } from 'apollo-datasource-rest'

/**
 * An Apollo REST data source for using the FlyBase API
 */
class FlyBaseAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = 'http://localhost:7082/api/'
  }

  async searchExpressionToolsByGene({ gene }) {
    return this.get('/expression/tools', { gene })
  }

  async searchExpressionToolsByExpression({ expression }) {
    return this.get('/expression/tools', { ...expression })
  }
}

export default FlyBaseAPI
