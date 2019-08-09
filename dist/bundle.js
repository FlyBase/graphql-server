'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('@babel/polyfill');
var apolloServer = require('apollo-server');
var crossFetch = require('cross-fetch');
var apolloClient = require('apollo-client');
var apolloCacheInmemory = require('apollo-cache-inmemory');
var apolloLinkHttp = require('apollo-link-http');
var pickBy = _interopDefault(require('lodash.pickby'));
var isPlainObject = _interopDefault(require('lodash.isplainobject'));
var mapKeys = _interopDefault(require('lodash.mapkeys'));

var doc = {"kind":"Document","definitions":[{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Gene"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"symbol"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"alleles"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Allele"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"insertions"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Insertion"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Allele"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"symbol"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"isConstruct"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"geneIsRegulatoryRegion"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"classes"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AlleleClass"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"mutagens"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Mutagen"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"stocksCount"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"pubCount"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"knownLesion"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"constructs"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Construct"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"insertions"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Insertion"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"insertedElementTypes"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ToolUse"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"regRegions"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Tool"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"encodedTools"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Tool"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"encodedToolUses"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ToolUse"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"taggedWith"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Tool"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"tagUses"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ToolUse"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"alsoCarries"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Tool"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"AlleleClass"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Mutagen"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ToolUse"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Insertion"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"symbol"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"insertedElementTypes"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ToolUse"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"regRegions"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Tool"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"encodedTools"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Tool"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"encodedToolUses"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ToolUse"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"taggedWith"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Tool"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"tagUses"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ToolUse"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"alsoCarries"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Tool"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"stocksCount"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"pubCount"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Construct"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"symbol"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Tool"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"symbol"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Stock"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"genotype"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"stockNumber"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"center"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Query"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"allelesByGene"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"fbgn"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"isConstruct"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"geneIsRegulatoryRegion"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Gene"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"allele"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"fbal"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Allele"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"alleles"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"fbal_ids"},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},"directives":[]}],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Allele"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"insertionsWithoutAllelesByGene"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"fbgn"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Gene"}},"directives":[]}]}],"loc":{"start":0,"end":1327}};
    doc.loc.source = {"body":"type Gene {\n  id: ID!\n  symbol: String\n  alleles: [Allele]\n  insertions: [Insertion]\n}\n\ntype Allele {\n  id: ID!\n  symbol: String\n  isConstruct: Boolean\n  geneIsRegulatoryRegion: Boolean\n  classes: [AlleleClass]\n  mutagens: [Mutagen]\n  stocksCount: Int\n  pubCount: Int\n  knownLesion: Boolean\n  constructs: [Construct]\n  insertions: [Insertion]\n  insertedElementTypes: [ToolUse]\n  regRegions: [Tool]\n  encodedTools: [Tool]\n  encodedToolUses: [ToolUse]\n  taggedWith: [Tool]\n  tagUses: [ToolUse]\n  alsoCarries: [Tool]\n}\n\ntype AlleleClass {\n  id: ID!\n  name: String!\n}\n\ntype Mutagen {\n  id: ID!\n  name: String!\n}\n\ntype ToolUse {\n  id: ID!\n  name: String!\n}\n\ntype Insertion {\n  id: ID!\n  symbol: String\n  insertedElementTypes: [ToolUse]\n  regRegions: [Tool]\n  encodedTools: [Tool]\n  encodedToolUses: [ToolUse]\n  taggedWith: [Tool]\n  tagUses: [ToolUse]\n  alsoCarries: [Tool]\n  stocksCount: Int\n  pubCount: Int\n}\n\ntype Construct {\n  id: ID!\n  symbol: String\n}\n\ntype Tool {\n  id: ID!\n  symbol: String\n}\n\ntype Stock {\n  id: ID!\n  genotype: String\n  stockNumber: String\n  center: String\n}\n\ntype Query {\n  allelesByGene(\n    fbgn: String!\n    isConstruct: Boolean\n    geneIsRegulatoryRegion: Boolean\n  ): Gene\n  allele(fbal: String!): Allele\n  alleles(fbal_ids: [String]!): [Allele]\n  insertionsWithoutAllelesByGene(fbgn: String!): Gene\n}\n","name":"GraphQL request","locationOffset":{"line":1,"column":1}};

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

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var doc$1 = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllelesByGene"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fbgn"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isConstruct"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"defaultValue":{"kind":"BooleanValue","value":false},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"geneIsRegulatoryRegion"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"defaultValue":{"kind":"BooleanValue","value":false},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allGenes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"condition"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"uniquename"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fbgn"}}}]}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"uniquename"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"allelesByGeneId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"condition"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"isConstruct"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isConstruct"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"geneIsRegulatoryRegion"},"value":{"kind":"Variable","name":{"kind":"Name","value":"geneIsRegulatoryRegion"}}}]}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"alleleFields"},"directives":[]}]}}]}}]}}]}}]}},{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InsertionsWithoutAllelesByGene"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fbgn"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allGenes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"condition"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"uniquename"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fbgn"}}}]}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"uniquename"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"insertionsByGeneId"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fbtiId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"symbol"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"stocksCount"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"pubCount"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"constructsByInsertionId"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fbtpId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"symbol"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"toolUsesByConstructId"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"toolUses"},"directives":[]}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"toolsByConstructId"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"toolFields"},"directives":[]}]}}]}}]}}]}}]}}]}}]}}]}}]}},{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Allele"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fbal"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allAlleles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"condition"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"fbalId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fbal"}}}]}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"alleleFields"},"directives":[]}]}}]}}]}},{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Alleles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fbal_ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allelesByFbal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fbal_ids"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"alleleFields"},"directives":[]}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"alleleFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Allele"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"fbalId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"isConstruct"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"propagateTransgenicUses"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"geneIsRegulatoryRegion"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"stocksCount"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"pubCount"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"knownLesion"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"alleleClassesByAlleleId"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fbcvId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"alleleMutagensByAlleleId"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fbcvId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"insertionsByAlleleId"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fbtiId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"symbol"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"constructsByInsertionId"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fbtpId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"symbol"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"toolUsesByConstructId"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"toolUses"},"directives":[]}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"toolsByConstructId"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"toolFields"},"directives":[]}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"constructsByAlleleId"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fbtpId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"symbol"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"toolsByConstructId"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"toolFields"},"directives":[]}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"toolUsesByConstructId"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"toolUses"},"directives":[]}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"toolsByAlleleId"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"toolFields"},"directives":[]}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"toolUsesByAlleleId"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"toolUses"},"directives":[]}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"toolFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tool"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fbid"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"symbol"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"relType"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"toolUsesByToolId"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"toolUses"},"directives":[]}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"toolUses"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ToolUse"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fbcvId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]}]}}],"loc":{"start":0,"end":2573}};
    doc$1.loc.source = {"body":"query AllelesByGene(\n  $fbgn: String!\n  $isConstruct: Boolean = false\n  $geneIsRegulatoryRegion: Boolean = false\n) {\n  allGenes(condition: { uniquename: $fbgn }) {\n    nodes {\n      name\n      uniquename\n      allelesByGeneId(\n        condition: {\n          isConstruct: $isConstruct\n          geneIsRegulatoryRegion: $geneIsRegulatoryRegion\n        }\n      ) {\n        nodes {\n          ...alleleFields\n        }\n      }\n    }\n  }\n}\n\nquery InsertionsWithoutAllelesByGene($fbgn: String!) {\n  allGenes(condition: { uniquename: $fbgn }) {\n    nodes {\n      name\n      uniquename\n      insertionsByGeneId {\n        nodes {\n          fbtiId\n          symbol\n          stocksCount\n          pubCount\n          constructsByInsertionId {\n            nodes {\n              fbtpId\n              symbol\n              toolUsesByConstructId {\n                nodes {\n                  ...toolUses\n                }\n              }\n              toolsByConstructId {\n                nodes {\n                  ...toolFields\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nquery Allele($fbal: String!) {\n  allAlleles(condition: { fbalId: $fbal }) {\n    nodes {\n      ...alleleFields\n    }\n  }\n}\n\nquery Alleles($fbal_ids: [String]!) {\n  allelesByFbal(ids: $fbal_ids) {\n    nodes {\n      ...alleleFields\n    }\n  }\n}\n\nfragment alleleFields on Allele {\n  symbol\n  fbalId\n  isConstruct\n  propagateTransgenicUses\n  geneIsRegulatoryRegion\n  stocksCount\n  pubCount\n  knownLesion\n  alleleClassesByAlleleId {\n    nodes {\n      fbcvId\n      name\n    }\n  }\n  alleleMutagensByAlleleId {\n    nodes {\n      fbcvId\n      name\n    }\n  }\n  insertionsByAlleleId {\n    nodes {\n      fbtiId\n      symbol\n      constructsByInsertionId {\n        nodes {\n          fbtpId\n          symbol\n          toolUsesByConstructId {\n            nodes {\n              ...toolUses\n            }\n          }\n          toolsByConstructId {\n            nodes {\n              ...toolFields\n            }\n          }\n        }\n      }\n    }\n  }\n  constructsByAlleleId {\n    nodes {\n      fbtpId\n      symbol\n      toolsByConstructId {\n        nodes {\n          ...toolFields\n        }\n      }\n      toolUsesByConstructId {\n        nodes {\n          ...toolUses\n        }\n      }\n    }\n  }\n  toolsByAlleleId {\n    nodes {\n      ...toolFields\n    }\n  }\n  toolUsesByAlleleId {\n    nodes {\n      ...toolUses\n    }\n  }\n}\n\nfragment toolFields on Tool {\n  fbid\n  symbol\n  relType\n  toolUsesByToolId {\n    nodes {\n      ...toolUses\n    }\n  }\n}\n\nfragment toolUses on ToolUse {\n  fbcvId\n  name\n}\n","name":"GraphQL request","locationOffset":{"line":1,"column":1}};
  

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
    
        const AllelesByGene = oneQuery(doc$1, "AllelesByGene");
        
        const InsertionsWithoutAllelesByGene = oneQuery(doc$1, "InsertionsWithoutAllelesByGene");
        
        const Allele = oneQuery(doc$1, "Allele");
        
        const Alleles = oneQuery(doc$1, "Alleles");

var reformatAlleleByGene = function reformatAlleleByGene(gene) {
  var alleles = flattenNodes(gene.allelesByGeneId.nodes);
  var id = gene.uniquename,
      symbol = gene.name;
  return {
    id: id,
    symbol: symbol,
    alleles: alleles.map(function (allele) {
      return materializeTools(allele, {
        id: id,
        symbol: symbol
      });
    })
  };
};
var reformatAlleles = function reformatAlleles(nodes) {
  var alleles = flattenNodes(nodes);
  return alleles.map(function (allele) {
    return materializeTools(allele);
  });
};
var reformatInsertionByGene = function reformatInsertionByGene(gene) {
  var insertions = flattenNodes(gene.insertionsByGeneId.nodes);
  return {
    id: gene.uniquename,
    symbol: gene.name,
    insertions: insertions.map(function (insertion) {
      return materializeTools(insertion);
    })
  };
};
var reformatAllele = function reformatAllele(allele) {
  var node = flattenNodes([allele])[0];
  return materializeTools(node);
};

var materializeTools = function materializeTools() {
  var fbObject = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  /*
  Pull out attributes that we will need to process.
   The following uses object destructuring.
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Assigning_to_new_variable_names
  */
  var id = fbObject.id,
      _fbObject$propagateTr = fbObject.propagateTransgenicUses,
      propagateTransgenicUses = _fbObject$propagateTr === void 0 ? true : _fbObject$propagateTr,
      _fbObject$stocksCount = fbObject.stocksCount,
      stocksCount = _fbObject$stocksCount === void 0 ? 0 : _fbObject$stocksCount,
      _fbObject$knownLesion = fbObject.knownLesion,
      knownLesion = _fbObject$knownLesion === void 0 ? false : _fbObject$knownLesion,
      _fbObject$insertions = fbObject.insertions,
      insertions = _fbObject$insertions === void 0 ? [] : _fbObject$insertions,
      _fbObject$constructs = fbObject.constructs,
      constructs = _fbObject$constructs === void 0 ? [] : _fbObject$constructs,
      _fbObject$toolUses = fbObject.toolUses,
      toolUses = _fbObject$toolUses === void 0 ? [] : _fbObject$toolUses,
      restProps = _objectWithoutProperties(fbObject, ["id", "propagateTransgenicUses", "stocksCount", "knownLesion", "insertions", "constructs", "toolUses"]);

  var isAllele = /^FBal\d+$/.test(id); // Pull data from construct if we are supposed to.

  if (propagateTransgenicUses) {
    toolUses.push.apply(toolUses, _toConsumableArray(getInsertedElementTypes(insertions, constructs)));
  }

  var encodedTools = getTools(fbObject, 'encodes_tool', propagateTransgenicUses);

  if (fbObject.isConstruct && encodedTools.length === 0 && parent && parent.id) {
    var isGene = /^FBgn\d+$/.test(parent.id);
    if (isGene) encodedTools.push(parent);
  }

  var taggedWith = getTools(fbObject, 'tagged_with', propagateTransgenicUses);

  var materializedFbObject = _objectSpread2({}, restProps, {
    id: id,
    stocksCount: stocksCount,
    knownLesion: knownLesion,
    insertions: insertions,
    constructs: constructs,
    insertedElementTypes: toolUses,
    regRegions: getTools(fbObject, 'has_reg_region', propagateTransgenicUses),
    encodedTools: encodedTools,
    encodedToolUses: getToolUses(encodedTools),
    taggedWith: taggedWith,
    tagUses: getToolUses(taggedWith),
    alsoCarries: getTools(fbObject, 'carries_tool', propagateTransgenicUses)
  });

  if (!isAllele) {
    // Delete these fields if record is not an allele.
    delete materializedFbObject.isConstruct;
    delete materializedFbObject.knownLesion;
    delete materializedFbObject.classes;
    delete materializedFbObject.mutagens;
    delete materializedFbObject.geneIsRegulatoryRegion;
  } else {
    if (materializedFbObject.isConstruct) {
      // Delete insertion related fields for construct alleles.
      delete materializedFbObject.insertions;
      delete materializedFbObject.insertedElementTypes;
    } else {
      // Delete constructs field for classical/insertion alleles.
      delete materializedFbObject.constructs;
    }
  }

  return materializedFbObject;
};

var getInsertedElementTypes = function getInsertedElementTypes() {
  var insertions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var constructs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  // Get tool uses attached to allele->insertion->construct
  var insertionToolUses = insertions.reduce(function (accum, insertion) {
    insertion.constructs.forEach(function (construct) {
      accum.push.apply(accum, _toConsumableArray(construct.toolUses));
    });
    return accum;
  }, []); // Get tool uses attached to allele->constructs or insertion->construct

  var constructToolUses = constructs.reduce(function (accum, construct) {
    return [].concat(_toConsumableArray(accum), _toConsumableArray(construct.toolUses));
  }, []);
  return [].concat(_toConsumableArray(insertionToolUses), _toConsumableArray(constructToolUses));
};

var getTools = function getTools(object, relType) {
  var propagateTransgenicUses = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var tools = object.tools ? object.tools.filter(function (tool) {
    return tool.relType === relType;
  }) : [];

  if (propagateTransgenicUses) {
    var toolObjectParents = [];

    if (object.insertions) {
      toolObjectParents = object.insertions;
    } else if (object.constructs) {
      toolObjectParents = object.constructs;
    } // Get tool uses attached to allele->insertion->construct


    var constructTools = toolObjectParents.reduce(function (accum, parent) {
      if (parent.tools) {
        accum.push.apply(accum, _toConsumableArray(parent.tools.filter(function (tool) {
          return tool.relType === relType;
        })));
      }

      if (parent.constructs) {
        parent.constructs.forEach(function (construct) {
          // Collect all Encoded tools from the construct
          accum.push.apply(accum, _toConsumableArray(construct.tools.filter(function (tool) {
            return tool.relType === relType;
          })));
        });
      }

      return accum;
    }, []);
    tools.push.apply(tools, _toConsumableArray(constructTools));
  }

  return tools;
};

var getToolUses = function getToolUses() {
  var tools = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return tools.reduce(function (accum, tool) {
    if (tool.toolUses && tool.toolUses.length !== 0) {
      accum.push.apply(accum, _toConsumableArray(tool.toolUses));
    }

    return accum;
  }, []);
};
/*
Function that takes a field name from a Chado
Postgraphile GraphQL response and maps it to a simpler
biologist friendly name.
*/


var getSubFieldName = function getSubFieldName(name) {
  switch (name) {
    case 'allelesByGeneId':
      return 'alleles';

    case 'alleleClassesByAlleleId':
      return 'classes';

    case 'alleleMutagensByAlleleId':
      return 'mutagens';

    case 'insertionsByGeneId':
    case 'insertionsByAlleleId':
      return 'insertions';

    case 'constructsByInsertionId':
    case 'constructsByAlleleId':
      return 'constructs';

    case 'toolsByConstructId':
    case 'toolsByAlleleId':
      return 'tools';

    case 'toolUsesByToolId':
    case 'toolUsesByAlleleId':
    case 'toolUsesByConstructId':
      return 'toolUses';

    default:
      return name;
  }
};

var remapFbIdKey = function remapFbIdKey(key) {
  if (/^fb\w\wId$/.test(key)) {
    return 'id';
  } else if (/^fbid$/.test(key)) {
    return 'id';
  }

  return key;
};

var flattenNodes = function flattenNodes() {
  var nodes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return nodes.map(function (node) {
    /* Extract fields that have scalar values and also remap fields with 
       names like 'fbtpId' to 'id'.  PickBy takes an object and returns 
       a new object with fields for which the function passed in returns true.
       mapKeys takes the resulting object from PickBy and remaps the key names
       based on the function passed to it.
        Also removes the __typename attribute, which will be added back in
       by the next GraphSQL response.
       
       pickBy  - https://lodash.com/docs#pickBy
       mapKeys - https://lodash.com/docs#mapKeys
    */
    var nodeObject = mapKeys(pickBy(node, function (val, key) {
      return key !== '__typename' && !isPlainObject(val);
    }), function (value, key) {
      return remapFbIdKey(key);
    }); // Extract object type fields.

    var subObjects = pickBy(node, function (val) {
      return isPlainObject(val);
    }); // Recurse through the sub object fields.

    Object.keys(subObjects).forEach(function (subField) {
      // Check if sub field has a 'nodes' property
      if (subObjects[subField].nodes) {
        nodeObject[getSubFieldName(subField)] = flattenNodes(subObjects[subField].nodes);
      }
    });
    return nodeObject;
  });
};

var cache = new apolloCacheInmemory.InMemoryCache();
var link = new apolloLinkHttp.HttpLink({
  uri: 'http://localhost:5000/graphql',
  fetch: crossFetch.fetch
});
var psqlClient = new apolloClient.ApolloClient({
  cache: cache,
  link: link
});
/*
  The following resolvers map to available queries in the schema.graphql file.
  When called, each resolver calls GraphQL endpoints served by Postgraphile.
  The results from postgres are reformatted to fit the biological data model
  (modeled in the schema.graphql) and returned.
*/

var resolvers = {
  Query: {
    allelesByGene: function () {
      var _allelesByGene = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(obj, _ref, context, info_) {
        var fbgn, _ref$isConstruct, isConstruct, _ref$geneIsRegulatory, geneIsRegulatoryRegion, result;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                fbgn = _ref.fbgn, _ref$isConstruct = _ref.isConstruct, isConstruct = _ref$isConstruct === void 0 ? false : _ref$isConstruct, _ref$geneIsRegulatory = _ref.geneIsRegulatoryRegion, geneIsRegulatoryRegion = _ref$geneIsRegulatory === void 0 ? false : _ref$geneIsRegulatory;
                _context.next = 3;
                return psqlClient.query({
                  query: AllelesByGene,
                  variables: {
                    fbgn: fbgn,
                    isConstruct: isConstruct,
                    geneIsRegulatoryRegion: geneIsRegulatoryRegion
                  }
                })["catch"](function (e) {
                  return console.error(e);
                });

              case 3:
                result = _context.sent;
                return _context.abrupt("return", result.data.allGenes.nodes.length !== 0 ? reformatAlleleByGene(result.data.allGenes.nodes[0]) : null);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function allelesByGene(_x, _x2, _x3, _x4) {
        return _allelesByGene.apply(this, arguments);
      }

      return allelesByGene;
    }(),
    insertionsWithoutAllelesByGene: function () {
      var _insertionsWithoutAllelesByGene = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(obj, _ref2, context, info) {
        var fbgn, result;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                fbgn = _ref2.fbgn;
                _context2.next = 3;
                return psqlClient.query({
                  query: InsertionsWithoutAllelesByGene,
                  variables: {
                    fbgn: fbgn
                  }
                })["catch"](function (e) {
                  return console.error(e);
                });

              case 3:
                result = _context2.sent;
                return _context2.abrupt("return", result.data.allGenes.nodes.length !== 0 ? reformatInsertionByGene(result.data.allGenes.nodes[0]) : null);

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function insertionsWithoutAllelesByGene(_x5, _x6, _x7, _x8) {
        return _insertionsWithoutAllelesByGene.apply(this, arguments);
      }

      return insertionsWithoutAllelesByGene;
    }(),
    allele: function () {
      var _allele = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(obj, _ref3, context, info) {
        var fbal, result;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                fbal = _ref3.fbal;
                _context3.next = 3;
                return psqlClient.query({
                  query: Allele,
                  variables: {
                    fbal: fbal
                  }
                })["catch"](function (e) {
                  return console.error(e);
                });

              case 3:
                result = _context3.sent;
                return _context3.abrupt("return", result.data.allAlleles.nodes.length !== 0 ? reformatAllele(result.data.allAlleles.nodes[0]) : null);

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function allele(_x9, _x10, _x11, _x12) {
        return _allele.apply(this, arguments);
      }

      return allele;
    }(),
    alleles: function () {
      var _alleles = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(obj, _ref4, context, info) {
        var fbal_ids, result;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                fbal_ids = _ref4.fbal_ids;
                _context4.next = 3;
                return psqlClient.query({
                  query: Alleles,
                  variables: {
                    fbal_ids: fbal_ids
                  }
                })["catch"](function (e) {
                  return console.error(e);
                });

              case 3:
                result = _context4.sent;
                return _context4.abrupt("return", result.data.allelesByFbal.nodes.length != 0 ? reformatAlleles(result.data.allelesByFbal.nodes) : null);

              case 5:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function alleles(_x13, _x14, _x15, _x16) {
        return _alleles.apply(this, arguments);
      }

      return alleles;
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
