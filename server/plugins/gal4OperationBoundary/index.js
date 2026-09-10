const { parse, print, GraphQLError } = require('graphql');

const unavailable = () => new GraphQLError('This GraphQL operation is temporarily unavailable during maintenance.');

// Full normalized documents include selections, arguments, directives and fragments.
// Operation names alone are not a security boundary.
function createGal4OperationBoundary(approvedDocuments) {
  const approved = new Set(approvedDocuments.map((source) => {
    const document = parse(source);
    const operations = document.definitions.filter((node) => node.kind === 'OperationDefinition');
    if (operations.length !== 1 || operations[0].operation !== 'query') {
      throw new Error('Invalid approved GAL4 document');
    }
    return print(document);
  }));
  if (!approved.size) throw new Error('Missing approved GAL4 documents');
  return {
    requestDidStart() {
      return {
        didResolveOperation({ document, operation }) {
          const operations = document.definitions.filter((node) => node.kind === 'OperationDefinition');
          if (operations.length !== 1 || operation.operation !== 'query' || !approved.has(print(document))) {
            throw unavailable();
          }
        }
      };
    }
  };
}

function gal4HttpBoundary(req, res, next) {
  if (req.url !== '/') {
    return res.status(404).set('Cache-Control', 'no-store').type('text/plain').send('Not found');
  }
  if (req.method !== 'POST') {
    return res.status(405).set('Allow', 'POST').set('Cache-Control', 'no-store').type('text/plain').send('Unsupported request method');
  }
  next();
}

function gal4BodyBoundary(req, res, next) {
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body) || typeof body.query !== 'string') {
    return res.status(400).set('Cache-Control', 'no-store').type('text/plain').send('Invalid GraphQL request');
  }
  next();
}

function gal4JsonErrorBoundary(error, req, res, next) {
  const status = error && error.status === 413 ? 413 : 400;
  return res.status(status).set('Cache-Control', 'no-store').type('text/plain').send('Invalid GraphQL request body');
}

module.exports = { createGal4OperationBoundary, gal4HttpBoundary, gal4BodyBoundary, gal4JsonErrorBoundary };
