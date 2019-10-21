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
  introspection: true,
  playground: true,
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
