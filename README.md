# graphql-server
A repository that generates a GQL API based on chado data, as well as Alliance and FlyBase APIs.

## Quick Start
```bash
git clone https://github.com/FlyBase/graphql-server
cd graphql-server
yarn install
PGPASSWORD=mypassword PGDATABASE=mydb yarn run start
```

This will start an Apollo GraphQL server on port 4000. Any PostgreSQL environment variables that are required
should be passed to the script (see https://www.postgresql.org/docs/current/libpq-envars.html).

## Terms/Technologies

- `PostgresQL Database`: Named FBYEAR_##, created from the chado-graphql.sql dump file (which is generated from the chado repository)
- `graphql`: A standard specification for a querying language. In and of itself, gql does not do anything. It does not define or implement a way to connect to a database, a method for retrieving data, or even a library for utilizing itself. Similar to how EcmaScript is just a description of what something should be, while JavaScript is an implementation of that description, GraphQL is only the description part. In order to use it, you must utilize a technology that implements the GraphQL specification, such as Apollo, or postgraphile, or in this case, both! 
- `apollo`: A collection of libraries which implement the graphql spec.
  - `apollo-server`: A library dedicated to building a graphql API, and creating a server to which a client can connect to and query from.
  - `apollo-client`: A library dedicated to consuming a graphql API by connecting to a graphql-compliant server.
- `postgraphile`: A library that generates a graphql schema based on a postgres database. Has built-in features for relationships, pagination, and other goodies. Can be used as a stand-alone library for running a gql server, or, in our case, can be used to generate the necessary building blocks to a gql server that can be used by another technology, like Apollo.
- `gql schema`: The type definitions required for a graphql server to operate. Very similar to type definitions within TypeScript. The schema works like an interface, defining the things that can be done, but not actually implementing them.
- `resolvers`: A graphql concept that is responsible for generating information for a given field. Every field (including nested fields) of a gql type can have a resolver associated with it. Each resolver can be passed information about the request, and returns the value for that field. Resolvers can be as general as "return all items", or as specific as "for foo.bar.thing.stuff.child" return a string based on some input criteria. Technologies like Apollo and postgraphile generate resolvers automatically, based on the schema. You can usually modify the result of those default resolvers, or write wrapper functions around them.
- `plugins`: A piece of code that modifies some aspect of the gql server technology. Both Apollo and postgraphile have the ability to create plugins, but these plugins are NOT interchangeable. GraphQL does NOT define any specifications for plugins.

## Server Automated Setup
1. Load the database with `make load-graphql`
2. Rebuild graphql-server with `make rebuild-graphql`

## Manual Setup

### Setting Up the Database
1. At each release, or manually, a `chado-graphql.sql` file is generated using the `chado` git repository. This file is loaded into rsync
2. Retrieve the file from rsync
3. Load the database using `make load-postgresql` (or manually). You may need to make argosadm (or whichever account you are using) a super admin within psql.
4. Ensure your .env variables are up-to-date for the release you are using. These should include the current release number, PGUSER, and PGPASSWORD

### Building the Project
1. `yarn clean-pull`: deletes changes and pulls the branch
2. `yarn stop`: stops the pm2 services
3. `yarn install`: updates npm packages and installs missing ones
4. `yarn build`: creates a new build
5. `yarn start`: starts the pm2 services
6. `yarn clear-cache`: clears the server cache

## Misc. Information and Tips

### GraphQL Help
GraphQL is a little different from SQL or any other technology. The specification itself is rather simple, which is a double-edged sword. See the "official" docs here:
https://graphql.org/

I say "official" because, like mentioned above, graphql itself is simply the spec, not any implementation. Nonetheless, and in the spirit of confusing nomenclature, the `graphql` npm library, named `graphql.js` is the JS implementation from the official creators of the spec.

I recommend getting conformable with the following:
- types
  - (normal types using `type Foo {}`)
  - interfaces (`interface Foo {}`)
  - input types (`input Foo {}`)
  - unions (`union FooOrBar = Foo | Bar`)
- fragments (`fragment JustId on Foo { id }`)
- arguments (inputs)
- resolvers
- directives
  - `@skip`
  - `@include`
- root types
  - `Query`
  - `Mutation`
  - `Subscription`

You certainly won't need all of these, but knowing what they are used for is super helpful in ruling out options for new features.

### Postgraphile Help
Postgraphile utilizes a core set of libraries from `graphile`. Graphile is intended to be database agnostic, and contains a lot of useful info.

That being said, the documentation is horrendous. It is poorly organized, lacks examples, split over several domains with similar site design.

Not all features are available through postgraphile alone, and require more-custom work to be done with the core graphile libraries.

The next version of postgraphile seems to fix some of these issues, both in practice and documentation, but the grass is always greener.

The `postgraphile-apollo-server` library provides an adapter for postgraphile to apollo, but does not work for newer apollo versions.