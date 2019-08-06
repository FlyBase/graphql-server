# graphql-server

## Quick Start
```bash
git clone https://github.com/FlyBase/graphql-server
cd graphql-server
PGPASSWORD=mypassword PGDATABASE=mydb yarn run prod
```

This will start an Apollo GraphQL server on port 4000 and a Postgraphile
server on port 5000.  Any PostgreSQL environment variables that are required
should be passed to the script (see https://www.postgresql.org/docs/current/libpq-envars.html).

## Overview
     GraphQL server ---> Postgraphile ---> Chado Database
                                     \
                                      ---> Other sources
## Description

This package provides a GraphQL server on top of Chado and other services for FlyBase.

                                   
