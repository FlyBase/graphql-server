import pickBy from 'lodash.pickby'
import isPlainObject from 'lodash.isplainobject'
import mapKeys from 'lodash.mapkeys'

export const reformatGene = gene => {
  const alleles = flattenNodes(gene.allelesByGeneId.nodes)
  return {
    id: gene.uniquename,
    symbol: gene.name,
    alleles: alleles.map(allele => {
      /*
      The following uses object destructuring.
      see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Assigning_to_new_variable_names
      */
      const {
        id,
        symbol,
        propagateTransgenicUses,
        isConstruct,
        classes,
        insertions,
        constructs,
        toolUses,
      } = allele

      if (propagateTransgenicUses) {
        toolUses.push(...getInsertedElementTypes(insertions, constructs))
      }

      const encodedTools = getTools(
        allele,
        'encodes_tool',
        propagateTransgenicUses
      )
      const taggedWith = getTools(
        allele,
        'tagged_with',
        propagateTransgenicUses
      )

      return {
        id,
        symbol,
        isConstruct,
        classes,
        insertedElementTypes: toolUses,
        regRegions: getTools(allele, 'has_reg_region', propagateTransgenicUses),
        encodedTools,
        encodedToolUses: getToolUses(encodedTools),
        taggedWith,
        tagUses: getToolUses(taggedWith),
        alsoCarries: getTools(allele, 'carries_tool', propagateTransgenicUses),
        stocksCount: 0,
      }
    }),
  }
}

const getInsertedElementTypes = (insertions, constructs) => {
  // Get tool uses attached to allele->insertion->construct
  const insertionToolUses = insertions.reduce((accum, insertion) => {
    insertion.constructs.forEach(construct => {
      accum.push(...construct.toolUses)
    })
    return accum
  }, [])
  // Get tool uses attached to allele->constructs
  const constructToolUses = constructs.reduce((accum, construct) => {
    return accum.push(...construct.toolUses)
  }, [])
  return [...insertionToolUses, ...constructToolUses]
}

const getTools = (object, relType, propagateTransgenicUses = false) => {
  const tools = object.tools.filter(tool => tool.relType === relType)
  if (propagateTransgenicUses) {
    // Get tool uses attached to allele->insertion->construct
    const constructTools = object.insertions.reduce((accum, insertion) => {
      insertion.constructs.forEach(construct => {
        // Collect all Encoded tools from the construct
        accum.push(...construct.tools.filter(tool => tool.relType === relType))
      })
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

const getSubFieldName = name => {
  switch (name) {
    case 'allelesByGeneId':
      return 'alleles'
    case 'alleleClassesByAlleleId':
      return 'classes'
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

export const format = ({ data = {} } = {}) => {
  try {
    const gene = data.allGenes.nodes[0]
    const alleles = flattenNodes(gene.allelesByGeneId.nodes)
    // Insertion only alleles will likely have to be in their own table.
    // const insertions = flattenNodes(gene.insertionsByGeneId.nodes)
    // alleles.push(insertions.map(insertion => ({ symbol: null, fbalId: null, insertions: insertion})))

    return {
      fbgnId: gene.uniquename,
      symbol: gene.name,
      alleles,
    }
  } catch (e) {
    throw Error(`Failed to parse gene/allele data from server: ${e.message}`)
  }
}
