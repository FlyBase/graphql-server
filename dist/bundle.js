// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"j9dv":[function(require,module,exports) {
module.exports = {
  "kind": "Document",
  "definitions": [{
    "kind": "ObjectTypeDefinition",
    "name": {
      "kind": "Name",
      "value": "Gene"
    },
    "interfaces": [],
    "directives": [],
    "fields": [{
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "id"
      },
      "arguments": [],
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "ID"
          }
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "symbol"
      },
      "arguments": [],
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "String"
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "alleles"
      },
      "arguments": [],
      "type": {
        "kind": "ListType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "Allele"
          }
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "insertions"
      },
      "arguments": [],
      "type": {
        "kind": "ListType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "Insertion"
          }
        }
      },
      "directives": []
    }]
  }, {
    "kind": "ObjectTypeDefinition",
    "name": {
      "kind": "Name",
      "value": "Allele"
    },
    "interfaces": [],
    "directives": [],
    "fields": [{
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "id"
      },
      "arguments": [],
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "ID"
          }
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "symbol"
      },
      "arguments": [],
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "String"
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "isConstruct"
      },
      "arguments": [],
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "Boolean"
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "geneIsRegulatoryRegion"
      },
      "arguments": [],
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "Boolean"
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "classes"
      },
      "arguments": [],
      "type": {
        "kind": "ListType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "CVTerm"
          }
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "mutagens"
      },
      "arguments": [],
      "type": {
        "kind": "ListType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "CVTerm"
          }
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "stocksCount"
      },
      "arguments": [],
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "Int"
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "pubCount"
      },
      "arguments": [],
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "Int"
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "knownLesion"
      },
      "arguments": [],
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "Boolean"
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "hasImage"
      },
      "arguments": [],
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "Boolean"
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "constructs"
      },
      "arguments": [],
      "type": {
        "kind": "ListType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "Construct"
          }
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "insertions"
      },
      "arguments": [],
      "type": {
        "kind": "ListType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "Insertion"
          }
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "insertedElementTypes"
      },
      "arguments": [],
      "type": {
        "kind": "ListType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "CVTerm"
          }
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "regRegions"
      },
      "arguments": [],
      "type": {
        "kind": "ListType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "Tool"
          }
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "encodedTools"
      },
      "arguments": [],
      "type": {
        "kind": "ListType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "Tool"
          }
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "encodedToolUses"
      },
      "arguments": [],
      "type": {
        "kind": "ListType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "CVTerm"
          }
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "taggedWith"
      },
      "arguments": [],
      "type": {
        "kind": "ListType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "Tool"
          }
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "tagUses"
      },
      "arguments": [],
      "type": {
        "kind": "ListType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "CVTerm"
          }
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "alsoCarries"
      },
      "arguments": [],
      "type": {
        "kind": "ListType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "Tool"
          }
        }
      },
      "directives": []
    }]
  }, {
    "kind": "ObjectTypeDefinition",
    "name": {
      "kind": "Name",
      "value": "CVTerm"
    },
    "interfaces": [],
    "directives": [],
    "fields": [{
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "id"
      },
      "arguments": [],
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "ID"
          }
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "name"
      },
      "arguments": [],
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "String"
          }
        }
      },
      "directives": []
    }]
  }, {
    "kind": "ObjectTypeDefinition",
    "name": {
      "kind": "Name",
      "value": "Insertion"
    },
    "interfaces": [],
    "directives": [],
    "fields": [{
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "id"
      },
      "arguments": [],
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "ID"
          }
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "symbol"
      },
      "arguments": [],
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "String"
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "insertedElementTypes"
      },
      "arguments": [],
      "type": {
        "kind": "ListType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "CVTerm"
          }
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "regRegions"
      },
      "arguments": [],
      "type": {
        "kind": "ListType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "Tool"
          }
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "encodedTools"
      },
      "arguments": [],
      "type": {
        "kind": "ListType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "Tool"
          }
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "encodedToolUses"
      },
      "arguments": [],
      "type": {
        "kind": "ListType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "CVTerm"
          }
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "taggedWith"
      },
      "arguments": [],
      "type": {
        "kind": "ListType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "Tool"
          }
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "tagUses"
      },
      "arguments": [],
      "type": {
        "kind": "ListType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "CVTerm"
          }
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "alsoCarries"
      },
      "arguments": [],
      "type": {
        "kind": "ListType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "Tool"
          }
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "stocksCount"
      },
      "arguments": [],
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "Int"
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "pubCount"
      },
      "arguments": [],
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "Int"
        }
      },
      "directives": []
    }]
  }, {
    "kind": "ObjectTypeDefinition",
    "name": {
      "kind": "Name",
      "value": "Construct"
    },
    "interfaces": [],
    "directives": [],
    "fields": [{
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "id"
      },
      "arguments": [],
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "ID"
          }
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "symbol"
      },
      "arguments": [],
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "String"
        }
      },
      "directives": []
    }]
  }, {
    "kind": "ObjectTypeDefinition",
    "name": {
      "kind": "Name",
      "value": "Tool"
    },
    "interfaces": [],
    "directives": [],
    "fields": [{
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "id"
      },
      "arguments": [],
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "ID"
          }
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "symbol"
      },
      "arguments": [],
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "String"
        }
      },
      "directives": []
    }]
  }, {
    "kind": "ObjectTypeDefinition",
    "name": {
      "kind": "Name",
      "value": "Stock"
    },
    "interfaces": [],
    "directives": [],
    "fields": [{
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "id"
      },
      "arguments": [],
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "ID"
          }
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "genotype"
      },
      "arguments": [],
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "String"
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "stockNumber"
      },
      "arguments": [],
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "String"
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "center"
      },
      "arguments": [],
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "String"
        }
      },
      "directives": []
    }]
  }, {
    "kind": "ObjectTypeDefinition",
    "name": {
      "kind": "Name",
      "value": "ExpressionToolSearchResult"
    },
    "interfaces": [],
    "directives": [],
    "fields": [{
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "id"
      },
      "arguments": [],
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "ID"
          }
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "expression_terms"
      },
      "arguments": [],
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "ListType",
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "CVTerm"
            }
          }
        }
      },
      "directives": []
    }]
  }, {
    "kind": "InputObjectTypeDefinition",
    "name": {
      "kind": "Name",
      "value": "ExpressionSearchInput"
    },
    "directives": [],
    "fields": [{
      "kind": "InputValueDefinition",
      "name": {
        "kind": "Name",
        "value": "stage"
      },
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "String"
        }
      },
      "directives": []
    }, {
      "kind": "InputValueDefinition",
      "name": {
        "kind": "Name",
        "value": "stageq"
      },
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "String"
        }
      },
      "directives": []
    }, {
      "kind": "InputValueDefinition",
      "name": {
        "kind": "Name",
        "value": "anatomy"
      },
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "String"
        }
      },
      "directives": []
    }, {
      "kind": "InputValueDefinition",
      "name": {
        "kind": "Name",
        "value": "anatomyq"
      },
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "String"
        }
      },
      "directives": []
    }, {
      "kind": "InputValueDefinition",
      "name": {
        "kind": "Name",
        "value": "subcellular"
      },
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "String"
        }
      },
      "directives": []
    }, {
      "kind": "InputValueDefinition",
      "name": {
        "kind": "Name",
        "value": "subcellularq"
      },
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "String"
        }
      },
      "directives": []
    }]
  }, {
    "kind": "UnionTypeDefinition",
    "name": {
      "kind": "Name",
      "value": "Result"
    },
    "directives": [],
    "types": [{
      "kind": "NamedType",
      "name": {
        "kind": "Name",
        "value": "ExpressionToolSearchResult"
      }
    }]
  }, {
    "kind": "ObjectTypeDefinition",
    "name": {
      "kind": "Name",
      "value": "FlyBaseAPIResult"
    },
    "interfaces": [],
    "directives": [],
    "fields": [{
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "resultset"
      },
      "arguments": [],
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "ResultSet"
          }
        }
      },
      "directives": []
    }]
  }, {
    "kind": "ObjectTypeDefinition",
    "name": {
      "kind": "Name",
      "value": "ResultSet"
    },
    "interfaces": [],
    "directives": [],
    "fields": [{
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "api_version"
      },
      "arguments": [],
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "String"
          }
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "data_version"
      },
      "arguments": [],
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "String"
          }
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "query_url"
      },
      "arguments": [],
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "String"
          }
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "query_time"
      },
      "arguments": [],
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "String"
          }
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "data_provider"
      },
      "arguments": [],
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "String"
          }
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "result"
      },
      "arguments": [],
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "ListType",
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Result"
              }
            }
          }
        }
      },
      "directives": []
    }]
  }, {
    "kind": "ObjectTypeDefinition",
    "name": {
      "kind": "Name",
      "value": "Query"
    },
    "interfaces": [],
    "directives": [],
    "fields": [{
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "allelesByGene"
      },
      "arguments": [{
        "kind": "InputValueDefinition",
        "name": {
          "kind": "Name",
          "value": "fbgn"
        },
        "type": {
          "kind": "NonNullType",
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          }
        },
        "directives": []
      }, {
        "kind": "InputValueDefinition",
        "name": {
          "kind": "Name",
          "value": "isConstruct"
        },
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "Boolean"
          }
        },
        "directives": []
      }, {
        "kind": "InputValueDefinition",
        "name": {
          "kind": "Name",
          "value": "geneIsRegulatoryRegion"
        },
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "Boolean"
          }
        },
        "directives": []
      }],
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "Gene"
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "alleleById"
      },
      "arguments": [{
        "kind": "InputValueDefinition",
        "name": {
          "kind": "Name",
          "value": "fbal"
        },
        "type": {
          "kind": "NonNullType",
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          }
        },
        "directives": []
      }],
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "Allele"
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "allelesByIds"
      },
      "arguments": [{
        "kind": "InputValueDefinition",
        "name": {
          "kind": "Name",
          "value": "fbal_ids"
        },
        "type": {
          "kind": "NonNullType",
          "type": {
            "kind": "ListType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "String"
              }
            }
          }
        },
        "directives": []
      }],
      "type": {
        "kind": "ListType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "Allele"
          }
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "insertionsWithoutAllelesByGene"
      },
      "arguments": [{
        "kind": "InputValueDefinition",
        "name": {
          "kind": "Name",
          "value": "fbgn"
        },
        "type": {
          "kind": "NonNullType",
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          }
        },
        "directives": []
      }],
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "Gene"
        }
      },
      "directives": []
    }, {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "searchExpressionTools"
      },
      "arguments": [{
        "kind": "InputValueDefinition",
        "name": {
          "kind": "Name",
          "value": "expression"
        },
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "ExpressionSearchInput"
          }
        },
        "directives": []
      }, {
        "kind": "InputValueDefinition",
        "name": {
          "kind": "Name",
          "value": "gene"
        },
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "String"
          }
        },
        "directives": []
      }],
      "type": {
        "kind": "ListType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "ExpressionToolSearchResult"
          }
        }
      },
      "directives": []
    }]
  }],
  "loc": {
    "start": 0,
    "end": 1840
  }
};
},{}],"XHMw":[function(require,module,exports) {
module.exports = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "query",
    "name": {
      "kind": "Name",
      "value": "AllelesByGene"
    },
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": {
          "kind": "Name",
          "value": "fbgn"
        }
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "String"
          }
        }
      },
      "directives": []
    }, {
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": {
          "kind": "Name",
          "value": "isConstruct"
        }
      },
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "Boolean"
        }
      },
      "defaultValue": {
        "kind": "BooleanValue",
        "value": false
      },
      "directives": []
    }, {
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": {
          "kind": "Name",
          "value": "geneIsRegulatoryRegion"
        }
      },
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "Boolean"
        }
      },
      "defaultValue": {
        "kind": "BooleanValue",
        "value": false
      },
      "directives": []
    }],
    "directives": [],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "allGenes"
        },
        "arguments": [{
          "kind": "Argument",
          "name": {
            "kind": "Name",
            "value": "condition"
          },
          "value": {
            "kind": "ObjectValue",
            "fields": [{
              "kind": "ObjectField",
              "name": {
                "kind": "Name",
                "value": "uniquename"
              },
              "value": {
                "kind": "Variable",
                "name": {
                  "kind": "Name",
                  "value": "fbgn"
                }
              }
            }]
          }
        }],
        "directives": [],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": {
              "kind": "Name",
              "value": "nodes"
            },
            "arguments": [],
            "directives": [],
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "name"
                },
                "arguments": [],
                "directives": []
              }, {
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "uniquename"
                },
                "arguments": [],
                "directives": []
              }, {
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "allelesByGeneId"
                },
                "arguments": [{
                  "kind": "Argument",
                  "name": {
                    "kind": "Name",
                    "value": "condition"
                  },
                  "value": {
                    "kind": "ObjectValue",
                    "fields": [{
                      "kind": "ObjectField",
                      "name": {
                        "kind": "Name",
                        "value": "isConstruct"
                      },
                      "value": {
                        "kind": "Variable",
                        "name": {
                          "kind": "Name",
                          "value": "isConstruct"
                        }
                      }
                    }, {
                      "kind": "ObjectField",
                      "name": {
                        "kind": "Name",
                        "value": "geneIsRegulatoryRegion"
                      },
                      "value": {
                        "kind": "Variable",
                        "name": {
                          "kind": "Name",
                          "value": "geneIsRegulatoryRegion"
                        }
                      }
                    }]
                  }
                }],
                "directives": [],
                "selectionSet": {
                  "kind": "SelectionSet",
                  "selections": [{
                    "kind": "Field",
                    "name": {
                      "kind": "Name",
                      "value": "nodes"
                    },
                    "arguments": [],
                    "directives": [],
                    "selectionSet": {
                      "kind": "SelectionSet",
                      "selections": [{
                        "kind": "FragmentSpread",
                        "name": {
                          "kind": "Name",
                          "value": "alleleFields"
                        },
                        "directives": []
                      }]
                    }
                  }]
                }
              }]
            }
          }]
        }
      }]
    }
  }, {
    "kind": "FragmentDefinition",
    "name": {
      "kind": "Name",
      "value": "toolFields"
    },
    "typeCondition": {
      "kind": "NamedType",
      "name": {
        "kind": "Name",
        "value": "Tool"
      }
    },
    "directives": [],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "fbid"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "symbol"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "relType"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "toolUsesByToolId"
        },
        "arguments": [],
        "directives": [],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": {
              "kind": "Name",
              "value": "nodes"
            },
            "arguments": [],
            "directives": [],
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "FragmentSpread",
                "name": {
                  "kind": "Name",
                  "value": "toolUses"
                },
                "directives": []
              }]
            }
          }]
        }
      }]
    }
  }, {
    "kind": "FragmentDefinition",
    "name": {
      "kind": "Name",
      "value": "toolUses"
    },
    "typeCondition": {
      "kind": "NamedType",
      "name": {
        "kind": "Name",
        "value": "ToolUse"
      }
    },
    "directives": [],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "fbcvId"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "name"
        },
        "arguments": [],
        "directives": []
      }]
    }
  }, {
    "kind": "FragmentDefinition",
    "name": {
      "kind": "Name",
      "value": "alleleFields"
    },
    "typeCondition": {
      "kind": "NamedType",
      "name": {
        "kind": "Name",
        "value": "Allele"
      }
    },
    "directives": [],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "symbol"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "fbalId"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "isConstruct"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "propagateTransgenicUses"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "geneIsRegulatoryRegion"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "stocksCount"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "pubCount"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "knownLesion"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "hasImage"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "alleleClassesByAlleleId"
        },
        "arguments": [],
        "directives": [],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": {
              "kind": "Name",
              "value": "nodes"
            },
            "arguments": [],
            "directives": [],
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "fbcvId"
                },
                "arguments": [],
                "directives": []
              }, {
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "name"
                },
                "arguments": [],
                "directives": []
              }]
            }
          }]
        }
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "alleleMutagensByAlleleId"
        },
        "arguments": [],
        "directives": [],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": {
              "kind": "Name",
              "value": "nodes"
            },
            "arguments": [],
            "directives": [],
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "fbcvId"
                },
                "arguments": [],
                "directives": []
              }, {
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "name"
                },
                "arguments": [],
                "directives": []
              }]
            }
          }]
        }
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "insertionsByAlleleId"
        },
        "arguments": [],
        "directives": [],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": {
              "kind": "Name",
              "value": "nodes"
            },
            "arguments": [],
            "directives": [],
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "fbtiId"
                },
                "arguments": [],
                "directives": []
              }, {
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "symbol"
                },
                "arguments": [],
                "directives": []
              }, {
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "constructsByInsertionId"
                },
                "arguments": [],
                "directives": [],
                "selectionSet": {
                  "kind": "SelectionSet",
                  "selections": [{
                    "kind": "Field",
                    "name": {
                      "kind": "Name",
                      "value": "nodes"
                    },
                    "arguments": [],
                    "directives": [],
                    "selectionSet": {
                      "kind": "SelectionSet",
                      "selections": [{
                        "kind": "Field",
                        "name": {
                          "kind": "Name",
                          "value": "fbtpId"
                        },
                        "arguments": [],
                        "directives": []
                      }, {
                        "kind": "Field",
                        "name": {
                          "kind": "Name",
                          "value": "symbol"
                        },
                        "arguments": [],
                        "directives": []
                      }, {
                        "kind": "Field",
                        "name": {
                          "kind": "Name",
                          "value": "toolUsesByConstructId"
                        },
                        "arguments": [],
                        "directives": [],
                        "selectionSet": {
                          "kind": "SelectionSet",
                          "selections": [{
                            "kind": "Field",
                            "name": {
                              "kind": "Name",
                              "value": "nodes"
                            },
                            "arguments": [],
                            "directives": [],
                            "selectionSet": {
                              "kind": "SelectionSet",
                              "selections": [{
                                "kind": "FragmentSpread",
                                "name": {
                                  "kind": "Name",
                                  "value": "toolUses"
                                },
                                "directives": []
                              }]
                            }
                          }]
                        }
                      }, {
                        "kind": "Field",
                        "name": {
                          "kind": "Name",
                          "value": "toolsByConstructId"
                        },
                        "arguments": [],
                        "directives": [],
                        "selectionSet": {
                          "kind": "SelectionSet",
                          "selections": [{
                            "kind": "Field",
                            "name": {
                              "kind": "Name",
                              "value": "nodes"
                            },
                            "arguments": [],
                            "directives": [],
                            "selectionSet": {
                              "kind": "SelectionSet",
                              "selections": [{
                                "kind": "FragmentSpread",
                                "name": {
                                  "kind": "Name",
                                  "value": "toolFields"
                                },
                                "directives": []
                              }]
                            }
                          }]
                        }
                      }]
                    }
                  }]
                }
              }]
            }
          }]
        }
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "constructsByAlleleId"
        },
        "arguments": [],
        "directives": [],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": {
              "kind": "Name",
              "value": "nodes"
            },
            "arguments": [],
            "directives": [],
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "fbtpId"
                },
                "arguments": [],
                "directives": []
              }, {
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "symbol"
                },
                "arguments": [],
                "directives": []
              }, {
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "toolsByConstructId"
                },
                "arguments": [],
                "directives": [],
                "selectionSet": {
                  "kind": "SelectionSet",
                  "selections": [{
                    "kind": "Field",
                    "name": {
                      "kind": "Name",
                      "value": "nodes"
                    },
                    "arguments": [],
                    "directives": [],
                    "selectionSet": {
                      "kind": "SelectionSet",
                      "selections": [{
                        "kind": "FragmentSpread",
                        "name": {
                          "kind": "Name",
                          "value": "toolFields"
                        },
                        "directives": []
                      }]
                    }
                  }]
                }
              }, {
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "toolUsesByConstructId"
                },
                "arguments": [],
                "directives": [],
                "selectionSet": {
                  "kind": "SelectionSet",
                  "selections": [{
                    "kind": "Field",
                    "name": {
                      "kind": "Name",
                      "value": "nodes"
                    },
                    "arguments": [],
                    "directives": [],
                    "selectionSet": {
                      "kind": "SelectionSet",
                      "selections": [{
                        "kind": "FragmentSpread",
                        "name": {
                          "kind": "Name",
                          "value": "toolUses"
                        },
                        "directives": []
                      }]
                    }
                  }]
                }
              }]
            }
          }]
        }
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "toolsByAlleleId"
        },
        "arguments": [],
        "directives": [],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": {
              "kind": "Name",
              "value": "nodes"
            },
            "arguments": [],
            "directives": [],
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "FragmentSpread",
                "name": {
                  "kind": "Name",
                  "value": "toolFields"
                },
                "directives": []
              }]
            }
          }]
        }
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "toolUsesByAlleleId"
        },
        "arguments": [],
        "directives": [],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": {
              "kind": "Name",
              "value": "nodes"
            },
            "arguments": [],
            "directives": [],
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "FragmentSpread",
                "name": {
                  "kind": "Name",
                  "value": "toolUses"
                },
                "directives": []
              }]
            }
          }]
        }
      }]
    }
  }],
  "loc": {
    "start": 0,
    "end": 1734
  }
};
},{}],"n8UT":[function(require,module,exports) {
module.exports = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "query",
    "name": {
      "kind": "Name",
      "value": "Allele"
    },
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": {
          "kind": "Name",
          "value": "fbal"
        }
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "String"
          }
        }
      },
      "directives": []
    }],
    "directives": [],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "allAlleles"
        },
        "arguments": [{
          "kind": "Argument",
          "name": {
            "kind": "Name",
            "value": "condition"
          },
          "value": {
            "kind": "ObjectValue",
            "fields": [{
              "kind": "ObjectField",
              "name": {
                "kind": "Name",
                "value": "fbalId"
              },
              "value": {
                "kind": "Variable",
                "name": {
                  "kind": "Name",
                  "value": "fbal"
                }
              }
            }]
          }
        }],
        "directives": [],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": {
              "kind": "Name",
              "value": "nodes"
            },
            "arguments": [],
            "directives": [],
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "FragmentSpread",
                "name": {
                  "kind": "Name",
                  "value": "alleleFields"
                },
                "directives": []
              }]
            }
          }]
        }
      }]
    }
  }, {
    "kind": "FragmentDefinition",
    "name": {
      "kind": "Name",
      "value": "toolFields"
    },
    "typeCondition": {
      "kind": "NamedType",
      "name": {
        "kind": "Name",
        "value": "Tool"
      }
    },
    "directives": [],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "fbid"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "symbol"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "relType"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "toolUsesByToolId"
        },
        "arguments": [],
        "directives": [],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": {
              "kind": "Name",
              "value": "nodes"
            },
            "arguments": [],
            "directives": [],
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "FragmentSpread",
                "name": {
                  "kind": "Name",
                  "value": "toolUses"
                },
                "directives": []
              }]
            }
          }]
        }
      }]
    }
  }, {
    "kind": "FragmentDefinition",
    "name": {
      "kind": "Name",
      "value": "toolUses"
    },
    "typeCondition": {
      "kind": "NamedType",
      "name": {
        "kind": "Name",
        "value": "ToolUse"
      }
    },
    "directives": [],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "fbcvId"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "name"
        },
        "arguments": [],
        "directives": []
      }]
    }
  }, {
    "kind": "FragmentDefinition",
    "name": {
      "kind": "Name",
      "value": "alleleFields"
    },
    "typeCondition": {
      "kind": "NamedType",
      "name": {
        "kind": "Name",
        "value": "Allele"
      }
    },
    "directives": [],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "symbol"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "fbalId"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "isConstruct"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "propagateTransgenicUses"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "geneIsRegulatoryRegion"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "stocksCount"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "pubCount"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "knownLesion"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "hasImage"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "alleleClassesByAlleleId"
        },
        "arguments": [],
        "directives": [],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": {
              "kind": "Name",
              "value": "nodes"
            },
            "arguments": [],
            "directives": [],
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "fbcvId"
                },
                "arguments": [],
                "directives": []
              }, {
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "name"
                },
                "arguments": [],
                "directives": []
              }]
            }
          }]
        }
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "alleleMutagensByAlleleId"
        },
        "arguments": [],
        "directives": [],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": {
              "kind": "Name",
              "value": "nodes"
            },
            "arguments": [],
            "directives": [],
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "fbcvId"
                },
                "arguments": [],
                "directives": []
              }, {
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "name"
                },
                "arguments": [],
                "directives": []
              }]
            }
          }]
        }
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "insertionsByAlleleId"
        },
        "arguments": [],
        "directives": [],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": {
              "kind": "Name",
              "value": "nodes"
            },
            "arguments": [],
            "directives": [],
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "fbtiId"
                },
                "arguments": [],
                "directives": []
              }, {
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "symbol"
                },
                "arguments": [],
                "directives": []
              }, {
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "constructsByInsertionId"
                },
                "arguments": [],
                "directives": [],
                "selectionSet": {
                  "kind": "SelectionSet",
                  "selections": [{
                    "kind": "Field",
                    "name": {
                      "kind": "Name",
                      "value": "nodes"
                    },
                    "arguments": [],
                    "directives": [],
                    "selectionSet": {
                      "kind": "SelectionSet",
                      "selections": [{
                        "kind": "Field",
                        "name": {
                          "kind": "Name",
                          "value": "fbtpId"
                        },
                        "arguments": [],
                        "directives": []
                      }, {
                        "kind": "Field",
                        "name": {
                          "kind": "Name",
                          "value": "symbol"
                        },
                        "arguments": [],
                        "directives": []
                      }, {
                        "kind": "Field",
                        "name": {
                          "kind": "Name",
                          "value": "toolUsesByConstructId"
                        },
                        "arguments": [],
                        "directives": [],
                        "selectionSet": {
                          "kind": "SelectionSet",
                          "selections": [{
                            "kind": "Field",
                            "name": {
                              "kind": "Name",
                              "value": "nodes"
                            },
                            "arguments": [],
                            "directives": [],
                            "selectionSet": {
                              "kind": "SelectionSet",
                              "selections": [{
                                "kind": "FragmentSpread",
                                "name": {
                                  "kind": "Name",
                                  "value": "toolUses"
                                },
                                "directives": []
                              }]
                            }
                          }]
                        }
                      }, {
                        "kind": "Field",
                        "name": {
                          "kind": "Name",
                          "value": "toolsByConstructId"
                        },
                        "arguments": [],
                        "directives": [],
                        "selectionSet": {
                          "kind": "SelectionSet",
                          "selections": [{
                            "kind": "Field",
                            "name": {
                              "kind": "Name",
                              "value": "nodes"
                            },
                            "arguments": [],
                            "directives": [],
                            "selectionSet": {
                              "kind": "SelectionSet",
                              "selections": [{
                                "kind": "FragmentSpread",
                                "name": {
                                  "kind": "Name",
                                  "value": "toolFields"
                                },
                                "directives": []
                              }]
                            }
                          }]
                        }
                      }]
                    }
                  }]
                }
              }]
            }
          }]
        }
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "constructsByAlleleId"
        },
        "arguments": [],
        "directives": [],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": {
              "kind": "Name",
              "value": "nodes"
            },
            "arguments": [],
            "directives": [],
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "fbtpId"
                },
                "arguments": [],
                "directives": []
              }, {
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "symbol"
                },
                "arguments": [],
                "directives": []
              }, {
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "toolsByConstructId"
                },
                "arguments": [],
                "directives": [],
                "selectionSet": {
                  "kind": "SelectionSet",
                  "selections": [{
                    "kind": "Field",
                    "name": {
                      "kind": "Name",
                      "value": "nodes"
                    },
                    "arguments": [],
                    "directives": [],
                    "selectionSet": {
                      "kind": "SelectionSet",
                      "selections": [{
                        "kind": "FragmentSpread",
                        "name": {
                          "kind": "Name",
                          "value": "toolFields"
                        },
                        "directives": []
                      }]
                    }
                  }]
                }
              }, {
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "toolUsesByConstructId"
                },
                "arguments": [],
                "directives": [],
                "selectionSet": {
                  "kind": "SelectionSet",
                  "selections": [{
                    "kind": "Field",
                    "name": {
                      "kind": "Name",
                      "value": "nodes"
                    },
                    "arguments": [],
                    "directives": [],
                    "selectionSet": {
                      "kind": "SelectionSet",
                      "selections": [{
                        "kind": "FragmentSpread",
                        "name": {
                          "kind": "Name",
                          "value": "toolUses"
                        },
                        "directives": []
                      }]
                    }
                  }]
                }
              }]
            }
          }]
        }
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "toolsByAlleleId"
        },
        "arguments": [],
        "directives": [],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": {
              "kind": "Name",
              "value": "nodes"
            },
            "arguments": [],
            "directives": [],
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "FragmentSpread",
                "name": {
                  "kind": "Name",
                  "value": "toolFields"
                },
                "directives": []
              }]
            }
          }]
        }
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "toolUsesByAlleleId"
        },
        "arguments": [],
        "directives": [],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": {
              "kind": "Name",
              "value": "nodes"
            },
            "arguments": [],
            "directives": [],
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "FragmentSpread",
                "name": {
                  "kind": "Name",
                  "value": "toolUses"
                },
                "directives": []
              }]
            }
          }]
        }
      }]
    }
  }],
  "loc": {
    "start": 0,
    "end": 1422
  }
};
},{}],"eXdW":[function(require,module,exports) {
module.exports = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "query",
    "name": {
      "kind": "Name",
      "value": "Alleles"
    },
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": {
          "kind": "Name",
          "value": "fbal_ids"
        }
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "ListType",
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          }
        }
      },
      "directives": []
    }],
    "directives": [],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "allelesByFbal"
        },
        "arguments": [{
          "kind": "Argument",
          "name": {
            "kind": "Name",
            "value": "ids"
          },
          "value": {
            "kind": "Variable",
            "name": {
              "kind": "Name",
              "value": "fbal_ids"
            }
          }
        }],
        "directives": [],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": {
              "kind": "Name",
              "value": "nodes"
            },
            "arguments": [],
            "directives": [],
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "FragmentSpread",
                "name": {
                  "kind": "Name",
                  "value": "alleleFields"
                },
                "directives": []
              }]
            }
          }]
        }
      }]
    }
  }, {
    "kind": "FragmentDefinition",
    "name": {
      "kind": "Name",
      "value": "toolFields"
    },
    "typeCondition": {
      "kind": "NamedType",
      "name": {
        "kind": "Name",
        "value": "Tool"
      }
    },
    "directives": [],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "fbid"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "symbol"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "relType"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "toolUsesByToolId"
        },
        "arguments": [],
        "directives": [],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": {
              "kind": "Name",
              "value": "nodes"
            },
            "arguments": [],
            "directives": [],
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "FragmentSpread",
                "name": {
                  "kind": "Name",
                  "value": "toolUses"
                },
                "directives": []
              }]
            }
          }]
        }
      }]
    }
  }, {
    "kind": "FragmentDefinition",
    "name": {
      "kind": "Name",
      "value": "toolUses"
    },
    "typeCondition": {
      "kind": "NamedType",
      "name": {
        "kind": "Name",
        "value": "ToolUse"
      }
    },
    "directives": [],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "fbcvId"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "name"
        },
        "arguments": [],
        "directives": []
      }]
    }
  }, {
    "kind": "FragmentDefinition",
    "name": {
      "kind": "Name",
      "value": "alleleFields"
    },
    "typeCondition": {
      "kind": "NamedType",
      "name": {
        "kind": "Name",
        "value": "Allele"
      }
    },
    "directives": [],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "symbol"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "fbalId"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "isConstruct"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "propagateTransgenicUses"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "geneIsRegulatoryRegion"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "stocksCount"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "pubCount"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "knownLesion"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "hasImage"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "alleleClassesByAlleleId"
        },
        "arguments": [],
        "directives": [],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": {
              "kind": "Name",
              "value": "nodes"
            },
            "arguments": [],
            "directives": [],
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "fbcvId"
                },
                "arguments": [],
                "directives": []
              }, {
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "name"
                },
                "arguments": [],
                "directives": []
              }]
            }
          }]
        }
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "alleleMutagensByAlleleId"
        },
        "arguments": [],
        "directives": [],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": {
              "kind": "Name",
              "value": "nodes"
            },
            "arguments": [],
            "directives": [],
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "fbcvId"
                },
                "arguments": [],
                "directives": []
              }, {
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "name"
                },
                "arguments": [],
                "directives": []
              }]
            }
          }]
        }
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "insertionsByAlleleId"
        },
        "arguments": [],
        "directives": [],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": {
              "kind": "Name",
              "value": "nodes"
            },
            "arguments": [],
            "directives": [],
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "fbtiId"
                },
                "arguments": [],
                "directives": []
              }, {
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "symbol"
                },
                "arguments": [],
                "directives": []
              }, {
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "constructsByInsertionId"
                },
                "arguments": [],
                "directives": [],
                "selectionSet": {
                  "kind": "SelectionSet",
                  "selections": [{
                    "kind": "Field",
                    "name": {
                      "kind": "Name",
                      "value": "nodes"
                    },
                    "arguments": [],
                    "directives": [],
                    "selectionSet": {
                      "kind": "SelectionSet",
                      "selections": [{
                        "kind": "Field",
                        "name": {
                          "kind": "Name",
                          "value": "fbtpId"
                        },
                        "arguments": [],
                        "directives": []
                      }, {
                        "kind": "Field",
                        "name": {
                          "kind": "Name",
                          "value": "symbol"
                        },
                        "arguments": [],
                        "directives": []
                      }, {
                        "kind": "Field",
                        "name": {
                          "kind": "Name",
                          "value": "toolUsesByConstructId"
                        },
                        "arguments": [],
                        "directives": [],
                        "selectionSet": {
                          "kind": "SelectionSet",
                          "selections": [{
                            "kind": "Field",
                            "name": {
                              "kind": "Name",
                              "value": "nodes"
                            },
                            "arguments": [],
                            "directives": [],
                            "selectionSet": {
                              "kind": "SelectionSet",
                              "selections": [{
                                "kind": "FragmentSpread",
                                "name": {
                                  "kind": "Name",
                                  "value": "toolUses"
                                },
                                "directives": []
                              }]
                            }
                          }]
                        }
                      }, {
                        "kind": "Field",
                        "name": {
                          "kind": "Name",
                          "value": "toolsByConstructId"
                        },
                        "arguments": [],
                        "directives": [],
                        "selectionSet": {
                          "kind": "SelectionSet",
                          "selections": [{
                            "kind": "Field",
                            "name": {
                              "kind": "Name",
                              "value": "nodes"
                            },
                            "arguments": [],
                            "directives": [],
                            "selectionSet": {
                              "kind": "SelectionSet",
                              "selections": [{
                                "kind": "FragmentSpread",
                                "name": {
                                  "kind": "Name",
                                  "value": "toolFields"
                                },
                                "directives": []
                              }]
                            }
                          }]
                        }
                      }]
                    }
                  }]
                }
              }]
            }
          }]
        }
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "constructsByAlleleId"
        },
        "arguments": [],
        "directives": [],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": {
              "kind": "Name",
              "value": "nodes"
            },
            "arguments": [],
            "directives": [],
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "fbtpId"
                },
                "arguments": [],
                "directives": []
              }, {
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "symbol"
                },
                "arguments": [],
                "directives": []
              }, {
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "toolsByConstructId"
                },
                "arguments": [],
                "directives": [],
                "selectionSet": {
                  "kind": "SelectionSet",
                  "selections": [{
                    "kind": "Field",
                    "name": {
                      "kind": "Name",
                      "value": "nodes"
                    },
                    "arguments": [],
                    "directives": [],
                    "selectionSet": {
                      "kind": "SelectionSet",
                      "selections": [{
                        "kind": "FragmentSpread",
                        "name": {
                          "kind": "Name",
                          "value": "toolFields"
                        },
                        "directives": []
                      }]
                    }
                  }]
                }
              }, {
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "toolUsesByConstructId"
                },
                "arguments": [],
                "directives": [],
                "selectionSet": {
                  "kind": "SelectionSet",
                  "selections": [{
                    "kind": "Field",
                    "name": {
                      "kind": "Name",
                      "value": "nodes"
                    },
                    "arguments": [],
                    "directives": [],
                    "selectionSet": {
                      "kind": "SelectionSet",
                      "selections": [{
                        "kind": "FragmentSpread",
                        "name": {
                          "kind": "Name",
                          "value": "toolUses"
                        },
                        "directives": []
                      }]
                    }
                  }]
                }
              }]
            }
          }]
        }
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "toolsByAlleleId"
        },
        "arguments": [],
        "directives": [],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": {
              "kind": "Name",
              "value": "nodes"
            },
            "arguments": [],
            "directives": [],
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "FragmentSpread",
                "name": {
                  "kind": "Name",
                  "value": "toolFields"
                },
                "directives": []
              }]
            }
          }]
        }
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "toolUsesByAlleleId"
        },
        "arguments": [],
        "directives": [],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": {
              "kind": "Name",
              "value": "nodes"
            },
            "arguments": [],
            "directives": [],
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "FragmentSpread",
                "name": {
                  "kind": "Name",
                  "value": "toolUses"
                },
                "directives": []
              }]
            }
          }]
        }
      }]
    }
  }],
  "loc": {
    "start": 0,
    "end": 1418
  }
};
},{}],"wlhe":[function(require,module,exports) {
module.exports = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "query",
    "name": {
      "kind": "Name",
      "value": "InsertionsWithoutAllelesByGene"
    },
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": {
          "kind": "Name",
          "value": "fbgn"
        }
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "String"
          }
        }
      },
      "directives": []
    }],
    "directives": [],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "allGenes"
        },
        "arguments": [{
          "kind": "Argument",
          "name": {
            "kind": "Name",
            "value": "condition"
          },
          "value": {
            "kind": "ObjectValue",
            "fields": [{
              "kind": "ObjectField",
              "name": {
                "kind": "Name",
                "value": "uniquename"
              },
              "value": {
                "kind": "Variable",
                "name": {
                  "kind": "Name",
                  "value": "fbgn"
                }
              }
            }]
          }
        }],
        "directives": [],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": {
              "kind": "Name",
              "value": "nodes"
            },
            "arguments": [],
            "directives": [],
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "name"
                },
                "arguments": [],
                "directives": []
              }, {
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "uniquename"
                },
                "arguments": [],
                "directives": []
              }, {
                "kind": "Field",
                "name": {
                  "kind": "Name",
                  "value": "insertionsByGeneId"
                },
                "arguments": [],
                "directives": [],
                "selectionSet": {
                  "kind": "SelectionSet",
                  "selections": [{
                    "kind": "Field",
                    "name": {
                      "kind": "Name",
                      "value": "nodes"
                    },
                    "arguments": [],
                    "directives": [],
                    "selectionSet": {
                      "kind": "SelectionSet",
                      "selections": [{
                        "kind": "Field",
                        "name": {
                          "kind": "Name",
                          "value": "fbtiId"
                        },
                        "arguments": [],
                        "directives": []
                      }, {
                        "kind": "Field",
                        "name": {
                          "kind": "Name",
                          "value": "symbol"
                        },
                        "arguments": [],
                        "directives": []
                      }, {
                        "kind": "Field",
                        "name": {
                          "kind": "Name",
                          "value": "stocksCount"
                        },
                        "arguments": [],
                        "directives": []
                      }, {
                        "kind": "Field",
                        "name": {
                          "kind": "Name",
                          "value": "pubCount"
                        },
                        "arguments": [],
                        "directives": []
                      }, {
                        "kind": "Field",
                        "name": {
                          "kind": "Name",
                          "value": "constructsByInsertionId"
                        },
                        "arguments": [],
                        "directives": [],
                        "selectionSet": {
                          "kind": "SelectionSet",
                          "selections": [{
                            "kind": "Field",
                            "name": {
                              "kind": "Name",
                              "value": "nodes"
                            },
                            "arguments": [],
                            "directives": [],
                            "selectionSet": {
                              "kind": "SelectionSet",
                              "selections": [{
                                "kind": "Field",
                                "name": {
                                  "kind": "Name",
                                  "value": "fbtpId"
                                },
                                "arguments": [],
                                "directives": []
                              }, {
                                "kind": "Field",
                                "name": {
                                  "kind": "Name",
                                  "value": "symbol"
                                },
                                "arguments": [],
                                "directives": []
                              }, {
                                "kind": "Field",
                                "name": {
                                  "kind": "Name",
                                  "value": "toolUsesByConstructId"
                                },
                                "arguments": [],
                                "directives": [],
                                "selectionSet": {
                                  "kind": "SelectionSet",
                                  "selections": [{
                                    "kind": "Field",
                                    "name": {
                                      "kind": "Name",
                                      "value": "nodes"
                                    },
                                    "arguments": [],
                                    "directives": [],
                                    "selectionSet": {
                                      "kind": "SelectionSet",
                                      "selections": [{
                                        "kind": "FragmentSpread",
                                        "name": {
                                          "kind": "Name",
                                          "value": "toolUses"
                                        },
                                        "directives": []
                                      }]
                                    }
                                  }]
                                }
                              }, {
                                "kind": "Field",
                                "name": {
                                  "kind": "Name",
                                  "value": "toolsByConstructId"
                                },
                                "arguments": [],
                                "directives": [],
                                "selectionSet": {
                                  "kind": "SelectionSet",
                                  "selections": [{
                                    "kind": "Field",
                                    "name": {
                                      "kind": "Name",
                                      "value": "nodes"
                                    },
                                    "arguments": [],
                                    "directives": [],
                                    "selectionSet": {
                                      "kind": "SelectionSet",
                                      "selections": [{
                                        "kind": "FragmentSpread",
                                        "name": {
                                          "kind": "Name",
                                          "value": "toolFields"
                                        },
                                        "directives": []
                                      }]
                                    }
                                  }]
                                }
                              }]
                            }
                          }]
                        }
                      }]
                    }
                  }]
                }
              }]
            }
          }]
        }
      }]
    }
  }, {
    "kind": "FragmentDefinition",
    "name": {
      "kind": "Name",
      "value": "toolFields"
    },
    "typeCondition": {
      "kind": "NamedType",
      "name": {
        "kind": "Name",
        "value": "Tool"
      }
    },
    "directives": [],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "fbid"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "symbol"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "relType"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "toolUsesByToolId"
        },
        "arguments": [],
        "directives": [],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": {
              "kind": "Name",
              "value": "nodes"
            },
            "arguments": [],
            "directives": [],
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "FragmentSpread",
                "name": {
                  "kind": "Name",
                  "value": "toolUses"
                },
                "directives": []
              }]
            }
          }]
        }
      }]
    }
  }, {
    "kind": "FragmentDefinition",
    "name": {
      "kind": "Name",
      "value": "toolUses"
    },
    "typeCondition": {
      "kind": "NamedType",
      "name": {
        "kind": "Name",
        "value": "ToolUse"
      }
    },
    "directives": [],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "fbcvId"
        },
        "arguments": [],
        "directives": []
      }, {
        "kind": "Field",
        "name": {
          "kind": "Name",
          "value": "name"
        },
        "arguments": [],
        "directives": []
      }]
    }
  }],
  "loc": {
    "start": 0,
    "end": 862
  }
};
},{}],"m8SM":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flattenNodes = exports.reformatAllele = exports.reformatInsertionByGene = exports.reformatAlleles = exports.reformatAlleleByGene = void 0;

var _lodash = _interopRequireDefault(require("lodash.pickby"));

var _lodash2 = _interopRequireDefault(require("lodash.isplainobject"));

var _lodash3 = _interopRequireDefault(require("lodash.mapkeys"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 *  Reformats the allele by gene response from Chado via Postgraphile.
 *
 * @param gene Gene object from Chado
 * @returns {{symbol: *, id: *, alleles: *}}
 */
const reformatAlleleByGene = gene => {
  const alleles = flattenNodes(gene.allelesByGeneId.nodes);
  const {
    uniquename: id,
    name: symbol
  } = gene;
  return {
    id,
    symbol,
    alleles: alleles.map(allele => materializeTools(allele, {
      id,
      symbol
    }))
  };
};
/**
 * Reformats an allele response from Chado via Postgraphile
 *
 * @param nodes An array of allele nodes.
 * @returns {{knownLesion: *, stocksCount: *, insertions: *, alsoCarries: *, taggedWith: *, encodedToolUses: *, insertedElementTypes: *, regRegions: *, tagUses: *, id: *, constructs: *, encodedTools: *}[]}
 */


exports.reformatAlleleByGene = reformatAlleleByGene;

const reformatAlleles = nodes => {
  const alleles = flattenNodes(nodes);
  return alleles.map(allele => materializeTools(allele));
};
/**
 * Reformats the insertion by gene response from Chado via Postgraphile
 * @param gene
 * @returns {{symbol: *, insertions: *, id: *}}
 */


exports.reformatAlleles = reformatAlleles;

const reformatInsertionByGene = gene => {
  const insertions = flattenNodes(gene.insertionsByGeneId.nodes);
  return {
    id: gene.uniquename,
    symbol: gene.name,
    insertions: insertions.map(insertion => materializeTools(insertion))
  };
};
/**
 * Reformats a single allele response from Chado via Postgraphile
 * @param allele
 * @returns {{knownLesion: *, stocksCount: *, insertions: *, alsoCarries: *, taggedWith: *, encodedToolUses: *, insertedElementTypes: *, regRegions: *, tagUses: *, id: *, constructs: *, encodedTools: *}}
 */


exports.reformatInsertionByGene = reformatInsertionByGene;

const reformatAllele = allele => {
  const node = flattenNodes([allele])[0];
  return materializeTools(node);
};
/**
 *
 * @param fbObject
 * @param parent
 * @returns {{knownLesion: *, stocksCount: *, insertions: *, alsoCarries: *, taggedWith: *, encodedToolUses: *, insertedElementTypes: *, regRegions: *, tagUses: *, id: *, constructs: *, encodedTools: *}}
 */


exports.reformatAllele = reformatAllele;

const materializeTools = (fbObject = {}, parent = {}) => {
  /*
  Pull out attributes that we will need to process.
   The following uses object destructuring.
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Assigning_to_new_variable_names
  */
  const {
    id,
    propagateTransgenicUses = true,
    stocksCount = 0,
    knownLesion = false,
    insertions = [],
    constructs = [],
    toolUses = []
  } = fbObject,
        restProps = _objectWithoutProperties(fbObject, ["id", "propagateTransgenicUses", "stocksCount", "knownLesion", "insertions", "constructs", "toolUses"]);

  const isAllele = /^FBal\d+$/.test(id); // Pull data from construct if we are supposed to.

  if (propagateTransgenicUses) {
    toolUses.push(...getInsertedElementTypes(insertions, constructs));
  }

  const encodedTools = getTools(fbObject, 'encodes_tool', propagateTransgenicUses);

  if (fbObject.isConstruct && encodedTools.length === 0 && parent && parent.id) {
    const isGene = /^FBgn\d+$/.test(parent.id);
    if (isGene) encodedTools.push(parent);
  }

  const taggedWith = getTools(fbObject, 'tagged_with', propagateTransgenicUses);

  const materializedFbObject = _objectSpread({}, restProps, {
    id,
    stocksCount,
    knownLesion,
    insertions,
    constructs,
    insertedElementTypes: toolUses,
    regRegions: getTools(fbObject, 'has_reg_region', propagateTransgenicUses),
    encodedTools,
    encodedToolUses: getToolUses(encodedTools),
    taggedWith,
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

const getInsertedElementTypes = (insertions = [], constructs = []) => {
  // Get tool uses attached to allele->insertion->construct
  const insertionToolUses = insertions.reduce((accum, insertion) => {
    insertion.constructs.forEach(construct => {
      accum.push(...construct.toolUses);
    });
    return accum;
  }, []); // Get tool uses attached to allele->constructs or insertion->construct

  const constructToolUses = constructs.reduce((accum, construct) => {
    return [...accum, ...construct.toolUses];
  }, []);
  return [...insertionToolUses, ...constructToolUses];
};

const getTools = (object, relType, propagateTransgenicUses = false) => {
  const tools = object.tools ? object.tools.filter(tool => tool.relType === relType) : [];

  if (propagateTransgenicUses) {
    let toolObjectParents = [];

    if (object.insertions) {
      toolObjectParents = object.insertions;
    } else if (object.constructs) {
      toolObjectParents = object.constructs;
    } // Get tool uses attached to allele->insertion->construct


    const constructTools = toolObjectParents.reduce((accum, parent) => {
      if (parent.tools) {
        accum.push(...parent.tools.filter(tool => tool.relType === relType));
      }

      if (parent.constructs) {
        parent.constructs.forEach(construct => {
          // Collect all Encoded tools from the construct
          accum.push(...construct.tools.filter(tool => tool.relType === relType));
        });
      }

      return accum;
    }, []);
    tools.push(...constructTools);
  }

  return tools;
};

const getToolUses = (tools = []) => {
  return tools.reduce((accum, tool) => {
    if (tool.toolUses && tool.toolUses.length !== 0) {
      accum.push(...tool.toolUses);
    }

    return accum;
  }, []);
};
/*
Function that takes a field name from a Chado
Postgraphile GraphQL response and maps it to a simpler
biologist friendly name.
*/


const getSubFieldName = name => {
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
/**
 * Remaps various ID fields in the Chado / Postgraphile materialized views from their name
 * to 'id'.
 * @param key
 * @returns {string|*}
 */


const remapFbIdKey = key => {
  if (/^fb\w\wId$/.test(key)) {
    return 'id';
  } else if (/^fbid$/.test(key)) {
    return 'id';
  }

  return key;
};

const flattenNodes = (nodes = []) => {
  return nodes.map(node => {
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
    const nodeObject = (0, _lodash3.default)((0, _lodash.default)(node, (val, key) => key !== '__typename' && !(0, _lodash2.default)(val)), (value, key) => remapFbIdKey(key)); // Extract object type fields.

    const subObjects = (0, _lodash.default)(node, val => (0, _lodash2.default)(val)); // Recurse through the sub object fields.

    Object.keys(subObjects).forEach(subField => {
      // Check if sub field has a 'nodes' property
      if (subObjects[subField].nodes) {
        nodeObject[getSubFieldName(subField)] = flattenNodes(subObjects[subField].nodes);
      }
    });
    return nodeObject;
  });
};

exports.flattenNodes = flattenNodes;
},{}],"iJA9":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CHADO_QUERY_ERROR = void 0;
const CHADO_QUERY_ERROR = 'CHADO_QUERY_ERROR';
exports.CHADO_QUERY_ERROR = CHADO_QUERY_ERROR;
},{}],"OJnd":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvers = exports.handleError = exports.psqlClient = void 0;

var _crossFetch = _interopRequireDefault(require("cross-fetch"));

var _apolloClient = require("apollo-client");

var _apolloCacheInmemory = require("apollo-cache-inmemory");

var _apolloLinkHttp = require("apollo-link-http");

var _apolloServer = require("apollo-server");

var _AllelesByGene = _interopRequireDefault(require("./chado/AllelesByGene.gql"));

var _Allele = _interopRequireDefault(require("./chado/Allele.gql"));

var _Alleles = _interopRequireDefault(require("./chado/Alleles.gql"));

var _InsertionsWithoutAllelesByGene = _interopRequireDefault(require("./chado/InsertionsWithoutAllelesByGene.gql"));

var _alleles = require("./chado/alleles");

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Functions for reformatting Chado GraphQL results
const cache = new _apolloCacheInmemory.InMemoryCache();
const link = new _apolloLinkHttp.HttpLink({
  uri: 'http://localhost:5000/graphql',
  fetch: _crossFetch.default
});
const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore'
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  }
}; // Initialize the client that we will use to query the Chado GraphQL endpoint.

const psqlClient = new _apolloClient.ApolloClient({
  cache,
  link,
  defaultOptions
});
/**
 * Error handler for GraphQL resolvers.
 * This code attempts to trap failures that happen at upstream GraphQL servers
 * and rethrow them as wrapped ApolloError objects.
 *
 * see https://www.apollographql.com/docs/apollo-server/data/errors/
 *
 * @param err Error object thrown by ApolloClient when contacting upstream GraphQL servers.
 * @param code Code for the error.
 * @param additionalProperties
 */

exports.psqlClient = psqlClient;

const handleError = (err, code = null, additionalProperties = null) => {
  if (err.networkError && err.networkError.result && err.networkError.result.errors) {
    throw new _apolloServer.ApolloError(err.networkError.result.errors.map(e => e.message).join(' '), code, additionalProperties);
  }

  throw err;
};
/*
  The following resolvers map to available queries in the schema.graphql file.
  When called, each resolver calls GraphQL endpoints served by Postgraphile.
  The results from postgres are reformatted to fit the biological data model
  (modeled in the schema.graphql) and returned.
*/


exports.handleError = handleError;
const resolvers = {
  /**
   * Need to resolve Union types from the GraphQL schema.  That is a single type
   * that can of one or more sub types.
   * see
   * https://www.apollographql.com/docs/apollo-server/features/unions-interfaces/#union-type
   */
  Result: {
    __resolveType(obj, context, info) {
      if (obj.expression_terms) {
        return 'ExpressionToolSearchResult';
      }

      return null;
    }

  },
  // Query resolvers.
  Query: {
    // Query Chado for all alleles by gene and reformat result.
    allelesByGene: async (_obj, {
      fbgn,
      isConstruct = false,
      geneIsRegulatoryRegion = false
    }, _context, _info_) => {
      const result = await psqlClient.query({
        query: _AllelesByGene.default,
        variables: {
          fbgn,
          isConstruct,
          geneIsRegulatoryRegion
        }
      }).catch(err => handleError(err, _constants.CHADO_QUERY_ERROR, {
        clientError: err
      }));
      return result && result.data && result.data.allGenes && result.data.allGenes.nodes && result.data.allGenes.nodes.length !== 0 ? (0, _alleles.reformatAlleleByGene)(result.data.allGenes.nodes[0]) : null;
    },
    // Query for insertions associated with a gene but no alleles.
    insertionsWithoutAllelesByGene: async (obj, {
      fbgn
    }, _context, _info) => {
      const result = await psqlClient.query({
        query: _InsertionsWithoutAllelesByGene.default,
        variables: {
          fbgn
        }
      }).catch(err => handleError(err, _constants.CHADO_QUERY_ERROR, {
        clientError: err
      }));
      return result && result.data && result.data.allGenes && result.data.allGenes.nodes && result.data.allGenes.nodes.length !== 0 ? (0, _alleles.reformatInsertionByGene)(result.data.allGenes.nodes[0]) : null;
    },
    // Query for an allele by ID.
    alleleById: async (_obj, {
      fbal
    }, _context, _info) => {
      const result = await psqlClient.query({
        query: _Allele.default,
        variables: {
          fbal
        }
      }).catch(err => handleError(err, _constants.CHADO_QUERY_ERROR, {
        clientError: err
      }));
      return result && result.data && result.data.allAlleles && result.data.allAlleles.nodes && result.data.allAlleles.nodes.length !== 0 ? (0, _alleles.reformatAllele)(result.data.allAlleles.nodes[0]) : null;
    },
    // Query for multiple alleles by ID.
    allelesByIds: async (_obj, {
      fbal_ids
    }, _context, _info) => {
      console.log(`Fetching ${fbal_ids.length} alleles by IDs from Chado.`);
      const result = await psqlClient.query({
        query: _Alleles.default,
        variables: {
          fbal_ids
        }
      }).catch(err => handleError(err, _constants.CHADO_QUERY_ERROR, {
        clientError: err
      }));
      console.log('Retrieved alleles, reformatting results.');
      return result && result.data && result.data.allelesByFbal && result.data.allelesByFbal.nodes && result.data.allelesByFbal.nodes.length !== 0 ? (0, _alleles.reformatAlleles)(result.data.allelesByFbal.nodes) : null;
    },
    // Search expression tools using the REST endpoint datasource.
    searchExpressionTools: async (_obj, {
      expression,
      gene
    }, {
      dataSources
    }, _info) => {
      console.log('Querying FlyBase API for expression tools.');

      if (gene && gene.length !== 0) {
        /**
         * Search by gene.
         */
        const data = await dataSources.flyBaseAPI.searchExpressionToolsByGene({
          gene
        });
        return data.resultset.result;
      } else if (expression && typeof expression === 'object' && Object.keys(expression).length > 0) {
        /**
         * Search by expression
         */
        const data = await dataSources.flyBaseAPI.searchExpressionToolsByExpression({
          expression
        });
        console.log('Done querying, returning results.');
        return data.resultset.result;
      }

      return null;
    }
  }
};
exports.resolvers = resolvers;
},{"./chado/AllelesByGene.gql":"XHMw","./chado/Allele.gql":"n8UT","./chado/Alleles.gql":"eXdW","./chado/InsertionsWithoutAllelesByGene.gql":"wlhe","./chado/alleles":"m8SM","./constants":"iJA9"}],"bEVX":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _apolloDatasourceRest = require("apollo-datasource-rest");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class FlyBaseAPI extends _apolloDatasourceRest.RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://localhost:7082/api/';
  }

  async searchExpressionToolsByGene({
    gene
  }) {
    return this.get('/expression/tools', {
      gene
    });
  }

  async searchExpressionToolsByExpression({
    expression
  }) {
    return this.get('/expression/tools', _objectSpread({}, expression));
  }

}

var _default = FlyBaseAPI;
exports.default = _default;
},{}],"Focm":[function(require,module,exports) {
"use strict";

var _apolloServer = require("apollo-server");

var Sentry = _interopRequireWildcard(require("@sentry/node"));

var _schema = _interopRequireDefault(require("./schema.gql"));

var _resolvers = require("./resolvers");

var _FlyBaseAPI = _interopRequireDefault(require("./datasources/FlyBaseAPI"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
Import the schema and resolvers for this GraphQL server.
In GraphSQL speak, resolvers are the functions that perform
the query and return results formatted according to the schema
*/
Sentry.init({
  dsn: 'https://a44fd5f15e834e20a0770d626e0e25c5@sentry.io/1788453'
}); // Create a new GraphQL server

const server = new _apolloServer.ApolloServer({
  typeDefs: _schema.default,
  resolvers: _resolvers.resolvers,
  // Allow query introspection.
  introspection: true,
  // Turn on GraphQL playground
  playground: true,
  formatError: err => {
    Sentry.captureException(err);
    return err;
  },
  dataSources: () => {
    return {
      flyBaseAPI: new _FlyBaseAPI.default()
    };
  }
}); // Start it up!

server.listen().then(({
  url
}) => {
  console.log(`🚀  Server ready at ${url}`);
});
},{"./schema.gql":"j9dv","./resolvers":"OJnd","./datasources/FlyBaseAPI":"bEVX"}]},{},["Focm"], null)