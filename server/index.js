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
import typeDefs from './schema.graphql'
import { resolvers } from './resolvers'

// Create a new GraphQL server
const server = new ApolloServer({ typeDefs, resolvers })

// Start it up!
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
