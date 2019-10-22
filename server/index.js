import { ApolloServer } from 'apollo-server'
import * as Sentry from '@sentry/node'

/*
Import the schema and resolvers for this GraphQL server.
In GraphSQL speak, resolvers are the functions that perform
the query and return results formatted according to the schema
*/
import typeDefs from './schema.gql'
import { resolvers } from './resolvers'
import FlyBaseAPI from './datasources/FlyBaseAPI'

Sentry.init({
  dsn: 'https://a44fd5f15e834e20a0770d626e0e25c5@sentry.io/1788453',
})

// Create a new GraphQL server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // Allow query introspection.
  introspection: true,
  // Turn on GraphQL playground
  playground: true,
  formatError: err => {
    Sentry.captureException(err)
    return err
  },
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
