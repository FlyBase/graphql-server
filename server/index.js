/*
 Required due to a RegeneratorRuntime error being thrown.
 see https://stackoverflow.com/a/54490329
*/
import '@babel/polyfill'
import { ApolloServer } from 'apollo-server'

/*
Import the schema and resolvers for this GraphQL server.
In GraphSQL speak, resolvers are the functions that perform
the query and return results formatted according to the schema
*/
import typeDefs from './schema.gql'
import { resolvers } from './resolvers'
import FlyBaseAPI from './datasources/FlyBaseAPI'

// Create a new GraphQL server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      flyBaseAPI: new FlyBaseAPI(),
    }
  },
})

// Start it up!
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
