# graphql-server

## Quick Start
```bash
git clone https://github.com/FlyBase/graphql-server
cd graphql-server
yarn install
PGPASSWORD=mypassword PGDATABASE=mydb yarn run prod
```

This will start an Apollo GraphQL server on port 4000 and a Postgraphile
server on port 5000.  Any PostgreSQL environment variables that are required
should be passed to the script (see https://www.postgresql.org/docs/current/libpq-envars.html).

## Overview
     GraphQL server ---> Postgraphile ---> Chado Database
                  \
                   ----> Other sources
## Description

This package provides a GraphQL server on top of Chado and other services for FlyBase.

## Adding REST APIs

This section describes how to integrate an in house or 3rd party 
REST API into the FlyBase GraphQL server.

See also the [Apollo Docs](https://www.apollographql.com/docs/tutorial/data-source/) on this.

### Integration steps

1. Add new datasource module under `server/datasources/`.

2. Modify it using the existing data sources as a guide.

3. 
                                   
