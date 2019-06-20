'use strict';

require('@babel/polyfill');
var apolloServer = require('apollo-server');
var crossFetch = require('cross-fetch');
var apolloClient = require('apollo-client');
var apolloCacheInmemory = require('apollo-cache-inmemory');
var apolloLinkHttp = require('apollo-link-http');

var doc = {"kind":"Document","definitions":[{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Gene"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"symbol"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"alleles"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Allele"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Allele"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"symbol"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Query"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"classicalAndInsertionAllelesByGene"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"fbgn"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Gene"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"classicalAndInsertionAllelesByAllele"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"fbal"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Allele"}},"directives":[]}]}],"loc":{"start":0,"end":241}};
    doc.loc.source = {"body":"type Gene {\n  id: ID!\n  symbol: String\n  alleles: [Allele]\n}\n\ntype Allele {\n  id: ID!\n  symbol: String\n}\n\ntype Query {\n  classicalAndInsertionAllelesByGene(fbgn: String!): Gene\n  classicalAndInsertionAllelesByAllele(fbal: String!): Allele\n}\n","name":"GraphQL request","locationOffset":{"line":1,"column":1}};

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var doc$1 = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ClassicalAndInsertionAllelesByGene"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fbgn"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isConstruct"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"defaultValue":{"kind":"BooleanValue","value":false},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allGenes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"condition"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"uniquename"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fbgn"}}}]}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"uniquename"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"allelesByGeneId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"condition"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"isConstruct"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isConstruct"}}}]}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"alleleFields"},"directives":[]}]}}]}}]}}]}}]}},{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ClassicalAndInsertionAllelesByAllele"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fbal"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allAlleles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"condition"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"fbalId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fbal"}}}]}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"alleleFields"},"directives":[]}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"alleleFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Allele"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"fbalId"},"arguments":[],"directives":[]}]}}],"loc":{"start":0,"end":2178}};
    doc$1.loc.source = {"body":"query ClassicalAndInsertionAllelesByGene(\n  $fbgn: String!\n  $isConstruct: Boolean = false\n) {\n  allGenes(condition: { uniquename: $fbgn }) {\n    nodes {\n      name\n      uniquename\n      # insertionsByGeneId @skip(if: $isConstruct) {\n      #   nodes {\n      #     fbtiId\n      #     symbol\n      #     constructsByInsertionId {\n      #       nodes {\n      #         fbtpId\n      #         symbol\n      #         toolUsesByConstructId {\n      #           nodes {\n      #             ...toolUses\n      #           }\n      #         }\n      #         toolsByConstructId {\n      #           nodes {\n      #             ...toolFields\n      #           }\n      #         }\n      #       }\n      #     }\n      #   }\n      # }\n      allelesByGeneId(condition: { isConstruct: $isConstruct }) {\n        nodes {\n          ...alleleFields\n        }\n      }\n    }\n  }\n}\n\nquery ClassicalAndInsertionAllelesByAllele($fbal: String!) {\n  allAlleles(condition: { fbalId: $fbal }) {\n    nodes {\n      ...alleleFields\n    }\n  }\n}\n\nfragment alleleFields on Allele {\n  symbol\n  fbalId\n  #isConstruct\n  #propagateTransgenicUses\n  #alleleClassesByAlleleId {\n  #  nodes {\n  #    fbcvId\n  #    name\n  #  }\n  #}\n  #insertionsByAlleleId {\n  #  nodes {\n  #    fbtiId\n  #    symbol\n  #    constructsByInsertionId {\n  #      nodes {\n  #        fbtpId\n  #        symbol\n  #        toolUsesByConstructId {\n  #          nodes {\n  #            ...toolUses\n  #          }\n  #        }\n  #        toolsByConstructId {\n  #          nodes {\n  #            ...toolFields\n  #          }\n  #        }\n  #      }\n  #    }\n  #  }\n  #}\n  #constructsByAlleleId {\n  #  nodes {\n  #    fbtpId\n  #    symbol\n  #    toolsByConstructId {\n  #      nodes {\n  #        ...toolFields\n  #      }\n  #    }\n  #    toolUsesByConstructId {\n  #      nodes {\n  #        ...toolUses\n  #      }\n  #    }\n  #  }\n  #}\n  #toolsByAlleleId {\n  #  nodes {\n  #    ...toolFields\n  #  }\n  #}\n  #toolUsesByAlleleId {\n  #  nodes {\n  #    ...toolUses\n  #  }\n  #}\n}\n\n#fragment toolFields on Tool {\n#  fbtoId\n#  symbol\n#  relType\n#  toolUsesByToolId {\n#    nodes {\n#      ...toolUses\n#    }\n#  }\n#\n#}\n#\n#fragment toolUses on ToolUse {\n#  fbcvId\n#  name\n#}\n","name":"GraphQL request","locationOffset":{"line":1,"column":1}};
  

    // Collect any fragment/type references from a node, adding them to the refs Set
    function collectFragmentReferences(node, refs) {
      if (node.kind === "FragmentSpread") {
        refs.add(node.name.value);
      } else if (node.kind === "VariableDefinition") {
        var type = node.type;
        if (type.kind === "NamedType") {
          refs.add(type.name.value);
        }
      }

      if (node.selectionSet) {
        node.selectionSet.selections.forEach(function(selection) {
          collectFragmentReferences(selection, refs);
        });
      }

      if (node.variableDefinitions) {
        node.variableDefinitions.forEach(function(def) {
          collectFragmentReferences(def, refs);
        });
      }

      if (node.definitions) {
        node.definitions.forEach(function(def) {
          collectFragmentReferences(def, refs);
        });
      }
    }

    var definitionRefs = {};
    (function extractReferences() {
      doc$1.definitions.forEach(function(def) {
        if (def.name) {
          var refs = new Set();
          collectFragmentReferences(def, refs);
          definitionRefs[def.name.value] = refs;
        }
      });
    })();

    function findOperation(doc, name) {
      for (var i = 0; i < doc.definitions.length; i++) {
        var element = doc.definitions[i];
        if (element.name && element.name.value == name) {
          return element;
        }
      }
    }

    function oneQuery(doc, operationName) {
      // Copy the DocumentNode, but clear out the definitions
      var newDoc = {
        kind: doc.kind,
        definitions: [findOperation(doc, operationName)]
      };
      if (doc.hasOwnProperty("loc")) {
        newDoc.loc = doc.loc;
      }

      // Now, for the operation we're running, find any fragments referenced by
      // it or the fragments it references
      var opRefs = definitionRefs[operationName] || new Set();
      var allRefs = new Set();
      var newRefs = new Set();

      // IE 11 doesn't support "new Set(iterable)", so we add the members of opRefs to newRefs one by one
      opRefs.forEach(function(refName) {
        newRefs.add(refName);
      });

      while (newRefs.size > 0) {
        var prevRefs = newRefs;
        newRefs = new Set();

        prevRefs.forEach(function(refName) {
          if (!allRefs.has(refName)) {
            allRefs.add(refName);
            var childRefs = definitionRefs[refName] || new Set();
            childRefs.forEach(function(childRef) {
              newRefs.add(childRef);
            });
          }
        });
      }

      allRefs.forEach(function(refName) {
        var op = findOperation(doc, refName);
        if (op) {
          newDoc.definitions.push(op);
        }
      });

      return newDoc;
    }
    
        const ClassicalAndInsertionAllelesByGene = oneQuery(doc$1, "ClassicalAndInsertionAllelesByGene");
        
        const ClassicalAndInsertionAllelesByAllele = oneQuery(doc$1, "ClassicalAndInsertionAllelesByAllele");

var cache = new apolloCacheInmemory.InMemoryCache();
var link = new apolloLinkHttp.HttpLink({
  uri: 'http://localhost:5000/graphql',
  fetch: crossFetch.fetch
});
var psqlClient = new apolloClient.ApolloClient({
  cache: cache,
  link: link
});
var resolvers = {
  Query: {
    classicalAndInsertionAllelesByGene: function () {
      var _classicalAndInsertionAllelesByGene = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(_, _ref, ___, ____) {
        var fbgn, result, gene;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                fbgn = _ref.fbgn;
                _context.next = 3;
                return psqlClient.query({
                  query: ClassicalAndInsertionAllelesByGene,
                  variables: {
                    fbgn: fbgn
                  }
                })["catch"](function (e) {
                  return console.error(e);
                });

              case 3:
                result = _context.sent;
                gene = result.data.allGenes.nodes[0];
                return _context.abrupt("return", {
                  id: gene.uniquename,
                  symbol: gene.name,
                  alleles: gene.allelesByGeneId.nodes.map(function (allele) {
                    return {
                      id: allele.fbalId,
                      symbol: allele.symbol
                    };
                  })
                });

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function classicalAndInsertionAllelesByGene(_x, _x2, _x3, _x4) {
        return _classicalAndInsertionAllelesByGene.apply(this, arguments);
      }

      return classicalAndInsertionAllelesByGene;
    }(),
    classicalAndInsertionAllelesByAllele: function () {
      var _classicalAndInsertionAllelesByAllele = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(_, _ref2, ___, ____) {
        var fbal, result, allele;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                fbal = _ref2.fbal;
                _context2.next = 3;
                return psqlClient.query({
                  query: ClassicalAndInsertionAllelesByAllele,
                  variables: {
                    fbal: fbal
                  }
                });

              case 3:
                result = _context2.sent;
                console.log(result);
                allele = result.data.allAlleles.nodes[0];
                return _context2.abrupt("return", {
                  id: allele.fbalId,
                  symbol: allele.symbol
                });

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function classicalAndInsertionAllelesByAllele(_x5, _x6, _x7, _x8) {
        return _classicalAndInsertionAllelesByAllele.apply(this, arguments);
      }

      return classicalAndInsertionAllelesByAllele;
    }()
  }
};

/*
 Required due to a RegeneratorRuntime error being thrown.
 see https://stackoverflow.com/a/54490329
*/

var server = new apolloServer.ApolloServer({
  typeDefs: doc,
  resolvers: resolvers
}); // Start it up!

server.listen().then(function (_ref) {
  var url = _ref.url;
  console.log("\uD83D\uDE80  Server ready at ".concat(url));
});
