import pickBy from 'lodash.pickby'
import isPlainObject from 'lodash.isplainobject'
import mapKeys from 'lodash.mapkeys'

export const reformatAlleleByGene = gene => {
  const alleles = flattenNodes(gene.allelesByGeneId.nodes)
  return {
    id: gene.uniquename,
    symbol: gene.name,
    alleles: alleles.map(materializeTools),
  }
}

export const reformatInsertionByGene = gene => {
  const insertions = flattenNodes(gene.insertionsByGeneId.nodes)
  return {
    id: gene.uniquename,
    symbol: gene.name,
    insertions: insertions.map(materializeTools),
  }
}

export const reformatAllele = allele => {
  const node = flattenNodes([allele])[0]
  return materializeTools(node)
}

const materializeTools = (fbObject = {}) => {
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
  const taggedWith = getTools(fbObject, 'tagged_with', propagateTransgenicUses)

  const materializedFbObject = {
    ...restProps,
    id,
    stocksCount,
    knownLesion,
    insertions,
    insertedElementTypes: toolUses,
    regRegions: getTools(fbObject, 'has_reg_region', propagateTransgenicUses),
    encodedTools,
    encodedToolUses: getToolUses(encodedTools),
    taggedWith,
    tagUses: getToolUses(taggedWith),
    alsoCarries: getTools(fbObject, 'carries_tool', propagateTransgenicUses),
  }
  if (!isAllele) {
    delete materializedFbObject.isConstruct
    delete materializedFbObject.stocksCount
    delete materializedFbObject.knownLesion
    delete materializedFbObject.classes
    delete materializedFbObject.mutagens
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

const remapFbIdKey = key => {
  return /^fb\w\wId$/.test(key) ? 'id' : key
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
