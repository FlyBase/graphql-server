const { parse, print, stripIgnoredCharacters, GraphQLError } = require('graphql');

const unavailable = () => new GraphQLError('This GraphQL operation is temporarily unavailable during maintenance.');

// These report documents must remain scoped to one gene. In particular, the
// toolkit wire document declares geneId optional; omitting it removes its filter.
const geneReportVariables = new Map([
  ['GeneToolKitMostCommonlyUsed', 'geneId'],
  ['classicalAndInsertionAllelesByGene', 'fbgn'],
  ['transgenicConstructAllelesByGene', 'fbgn'],
  ['insertionsWithoutAllelesByGene', 'fbgn'],
  ['alleleDiseaseVariantsByFBgn', 'fbgn'],
]);

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
        didResolveOperation({ document, operation, request }) {
          const operations = document.definitions.filter((node) => node.kind === 'OperationDefinition');
          if (operations.length !== 1 || operation.operation !== 'query' || !approved.has(print(document))) {
            throw unavailable();
          }
          const geneVariable = geneReportVariables.get(operation.name && operation.name.value);
          if (geneVariable) {
            const id = request && request.variables && request.variables[geneVariable];
            if (typeof id !== 'string' || !/^FBgn[0-9]{7}$/.test(id)) {
              throw new GraphQLError('A single FlyBase gene ID is required.', null, null, null, null, null, { code: 'BAD_USER_INPUT' });
            }
          }
        }
      };
    }
  };
}

// Express layer, in front of Apollo. Apollo parses AND validates a document
// before any plugin hook runs, and graphql-js validation can cost far more
// memory than a document's size suggests: on 2026-09-18 the server aborted
// twice with a V8 heap exhaustion inside getVariableUsages (validation), under
// ordinary traffic, taking the API down for ~5 minutes each time. The
// operation boundary above only runs in didResolveOperation, i.e. after that
// validation. This rejects every document that is not an approved one before
// Apollo sees it, so only approved documents are ever validated.
//
// The comparison key comes from stripIgnoredCharacters, which only runs the
// lexer, so its cost is linear in the text. Do not use print(parse()) here:
// print re-indents each nested block, so a 6 kB document nested 2,000 levels
// deep took 5.4 s of CPU on Node 10, blocking the event loop per request.
// The length cap runs first. The largest approved document is 2,393 chars.
const MAX_QUERY_LENGTH = 4096;

function unavailableResponse(res) {
  return res.status(400).set('Cache-Control', 'no-store').json({
    errors: [{ message: 'This GraphQL operation is temporarily unavailable during maintenance.' }],
  });
}

function createGal4DocumentBoundary(approvedDocuments, { maxQueryLength = MAX_QUERY_LENGTH } = {}) {
  if (!approvedDocuments.length) throw new Error('Missing approved GAL4 documents');
  if (approvedDocuments.some((source) => source.length > maxQueryLength)) {
    throw new Error('An approved GAL4 document exceeds the query length limit');
  }
  const raw = new Set(approvedDocuments);
  const normalized = new Set(approvedDocuments.map((source) => stripIgnoredCharacters(source)));
  return function gal4DocumentBoundary(req, res, next) {
    const query = req.body && req.body.query;
    // Fast path: the bundled client sends the approved text byte-for-byte.
    if (typeof query === 'string' && raw.has(query)) return next();
    if (typeof query !== 'string' || query.length > maxQueryLength) return unavailableResponse(res);
    let key;
    try {
      key = stripIgnoredCharacters(query);
    } catch (error) {
      // Lexer errors (unterminated strings, bad characters): not an approved document.
      return unavailableResponse(res);
    }
    return normalized.has(key) ? next() : unavailableResponse(res);
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

module.exports = { createGal4OperationBoundary, createGal4DocumentBoundary, gal4HttpBoundary,
  gal4BodyBoundary, gal4JsonErrorBoundary, MAX_QUERY_LENGTH };
