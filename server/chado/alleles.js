import pickBy from 'lodash.pickby'
import isPlainObject from 'lodash.isplainobject'
import mapKeys from 'lodash.mapkeys'

/**
 *  Reformats the allele by gene response from Chado via Postgraphile.
 *
 * @param gene Gene object from Chado
 * @returns {{symbol: *, id: *, alleles: *}}
 */
export const reformatAlleleByGene = gene => {
  const alleles = flattenNodes(gene.allelesByGeneId.nodes)
  const { uniquename: id, name: symbol } = gene
  return {
    id,
    symbol,
    alleles: alleles.map(allele => materializeTools(allele, { id, symbol })),
  }
}

/**
 * Reformats an allele response from Chado via Postgraphile
 *
 * @param nodes An array of allele nodes.
 * @returns {{knownLesion: *, stocksCount: *, insertions: *, alsoCarries: *, taggedWith: *, encodedToolUses: *, insertedElementTypes: *, regRegions: *, tagUses: *, id: *, constructs: *, encodedTools: *}[]}
 */
export const reformatAlleles = nodes => {
  const alleles = flattenNodes(nodes)
  return alleles.map(allele => materializeTools(allele))
}

/**
 * Reformats the insertion by gene response from Chado via Postgraphile
 * @param gene
 * @returns {{symbol: *, insertions: *, id: *}}
 */
export const reformatInsertionByGene = gene => {
  const insertions = flattenNodes(gene.insertionsByGeneId.nodes)
  return {
    id: gene.uniquename,
    symbol: gene.name,
    insertions: insertions.map(insertion => materializeTools(insertion)),
  }
}

/**
 * Reformats a single allele response from Chado via Postgraphile
 * @param allele
 * @returns {{knownLesion: *, stocksCount: *, insertions: *, alsoCarries: *, taggedWith: *, encodedToolUses: *, insertedElementTypes: *, regRegions: *, tagUses: *, id: *, constructs: *, encodedTools: *}}
 */
export const reformatAllele = allele => {
  const node = flattenNodes([allele])[0]
  return materializeTools(node)
}

/**
 *
 * @param fbObject
 * @param parent
 * @returns {{knownLesion: *, stocksCount: *, insertions: *, alsoCarries: *, taggedWith: *, encodedToolUses: *, insertedElementTypes: *, regRegions: *, tagUses: *, id: *, constructs: *, encodedTools: *}}
 */
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
    toolUses = [],
    ...restProps
  } = fbObject

  const isAllele = /^FBal\d+$/.test(id)

  // Pull data from construct if we are supposed to.
  if (propagateTransgenicUses) {
    toolUses.push(...getInsertedElementTypes(insertions, constructs))
  }

  const encodedTools = getTools(
    fbObject,
    'encodes_tool',
    propagateTransgenicUses
  )

  if (
    fbObject.isConstruct &&
    encodedTools.length === 0 &&
    parent &&
    parent.id
  ) {
    const isGene = /^FBgn\d+$/.test(parent.id)
    if (isGene) encodedTools.push(parent)
  }

  const taggedWith = getTools(fbObject, 'tagged_with', propagateTransgenicUses)

  const materializedFbObject = {
    ...restProps,
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
    alsoCarries: getTools(fbObject, 'carries_tool', propagateTransgenicUses),
  }

  if (!isAllele) {
    // Delete these fields if record is not an allele.
    delete materializedFbObject.isConstruct
    delete materializedFbObject.knownLesion
    delete materializedFbObject.classes
    delete materializedFbObject.mutagens
    delete materializedFbObject.geneIsRegulatoryRegion
  } else {
    if (materializedFbObject.isConstruct) {
      // Delete insertion related fields for construct alleles.
      delete materializedFbObject.insertions
      delete materializedFbObject.insertedElementTypes
    } else {
      // Delete constructs field for classical/insertion alleles.
      delete materializedFbObject.constructs
    }
  }
  return materializedFbObject
}

const getInsertedElementTypes = (insertions = [], constructs = []) => {
  // Get tool uses attached to allele->insertion->construct
  const insertionToolUses = insertions.reduce((accum, insertion) => {
    insertion.constructs.forEach(construct => {
      accum.push(...construct.toolUses)
    })
    return accum
  }, [])

  // Get tool uses attached to allele->constructs or insertion->construct
  const constructToolUses = constructs.reduce((accum, construct) => {
    return [...accum, ...construct.toolUses]
  }, [])
  return [...insertionToolUses, ...constructToolUses]
}

const getTools = (object, relType, propagateTransgenicUses = false) => {
  const tools = object.tools
    ? object.tools.filter(tool => tool.relType === relType)
    : []
  if (propagateTransgenicUses) {
    let toolObjectParents = []
    if (object.insertions) {
      toolObjectParents = object.insertions
    } else if (object.constructs) {
      toolObjectParents = object.constructs
    }
    // Get tool uses attached to allele->insertion->construct
    const constructTools = toolObjectParents.reduce((accum, parent) => {
      if (parent.tools) {
        accum.push(...parent.tools.filter(tool => tool.relType === relType))
      }
      if (parent.constructs) {
        parent.constructs.forEach(construct => {
          // Collect all Encoded tools from the construct
          accum.push(
            ...construct.tools.filter(tool => tool.relType === relType)
          )
        })
      }
      return accum
    }, [])
    tools.push(...constructTools)
  }
  return tools
}

const getToolUses = (tools = []) => {
  return tools.reduce((accum, tool) => {
    if (tool.toolUses && tool.toolUses.length !== 0) {
      accum.push(...tool.toolUses)
    }
    return accum
  }, [])
}

/*
Function that takes a field name from a Chado
Postgraphile GraphQL response and maps it to a simpler
biologist friendly name.
*/
const getSubFieldName = name => {
  switch (name) {
    case 'allelesByGeneId':
      return 'alleles'
    case 'alleleClassesByAlleleId':
      return 'classes'
    case 'alleleMutagensByAlleleId':
      return 'mutagens'
    case 'insertionsByGeneId':
    case 'insertionsByAlleleId':
      return 'insertions'
    case 'constructsByInsertionId':
    case 'constructsByAlleleId':
      return 'constructs'
    case 'toolsByConstructId':
    case 'toolsByAlleleId':
      return 'tools'
    case 'toolUsesByToolId':
    case 'toolUsesByAlleleId':
    case 'toolUsesByConstructId':
      return 'toolUses'
    default:
      return name
  }
}

/**
 * Remaps various ID fields in the Chado / Postgraphile materialized views from their name
 * to 'id'.
 * @param key
 * @returns {string|*}
 */
const remapFbIdKey = key => {
  if (/^fb\w\wId$/.test(key)) {
    return 'id'
  } else if (/^fbid$/.test(key)) {
    return 'id'
  }
  return key
}

export const flattenNodes = (nodes = []) => {
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
    const nodeObject = mapKeys(
      pickBy(node, (val, key) => key !== '__typename' && !isPlainObject(val)),
      (value, key) => remapFbIdKey(key)
    )

    // Extract object type fields.
    const subObjects = pickBy(node, val => isPlainObject(val))
    // Recurse through the sub object fields.
    Object.keys(subObjects).forEach(subField => {
      // Check if sub field has a 'nodes' property
      if (subObjects[subField].nodes) {
        nodeObject[getSubFieldName(subField)] = flattenNodes(
          subObjects[subField].nodes
        )
      }
    })
    return nodeObject
  })
}
