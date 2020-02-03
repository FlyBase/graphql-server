import { ApolloServer } from 'apollo-server'
import { ApolloGateway } from '@apollo/gateway'

const gateway = new ApolloGateway({
  serviceList: [
    { name: 'tools', url: 'http://localhost:4001/graphql' },
    { name: 'chado', url: 'http://localhost:5000/graphql' },
  ],
})

const server = new ApolloServer({ gateway, subscriptions: false })
server.listen({
  host: 'localhost',
  port: 4000,
})
