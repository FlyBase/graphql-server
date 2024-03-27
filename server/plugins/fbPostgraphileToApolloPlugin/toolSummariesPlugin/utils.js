//GQL does not support "exampleFieldWithEmptyArgumentParenthesis()", so only return something if the parent name is provided
const getParentIdCondition = parentName => parentName ? `(condition: { ${parentName}Id: $parentId })` : "";

/*
* Build GQL query strings, returning necessary info to build fields based on ToolUse.
* */
export const getToolUseQuery = parentName => `
  toolUses${getParentIdCondition(parentName)} {
    id
    name
  }
`;

export const getConstructToolUseQuery = parentName => `
  constructs${getParentIdCondition(parentName)} {
    ${getToolUseQuery()}
  }
`;

export const getInsertionToolUseQuery = parentName => `
  insertions${getParentIdCondition(parentName)} {
    ${getConstructToolUseQuery()}
  }
`;

// NOTE: this logic assumes this function is only used for Allele and Insertion types
export const getToolUseQueryForParentType = typename => `
  query ToolUseParentQuery($parentId: BigInt!) {
    ${typename === "allele" ? getToolUseQuery(typename): ""}
    ${typename === "allele" ? getInsertionToolUseQuery(typename): ""}
    ${getConstructToolUseQuery(typename)}
  }
`;

/*
* Build GQL query strings, returning necessary info to build fields based on Tool.
* */
export const getToolQuery = (parentName, relType, returnToolUses = false) => {
  const conditions = [
    ...(parentName ? [`${parentName}Id: $parentId`] : ""),
    ...(relType ? [`relType: "${relType}"`] : "")
  ].join(", ");

  return `
    tools${conditions ? `(condition: { ${conditions} })` : ""} {
      id
      symbol
      ${returnToolUses ? `
        toolUses: uses {
          id
          name
        }
      ` : ""}
    }
  `;
}

export const getConstructToolQuery = (parentName, relType, returnToolUses = false) => `
  constructs${getParentIdCondition(parentName)} {
    ${getToolQuery(undefined, relType, returnToolUses)}
  }
`;

export const getInsertionToolQuery = (parentName, relType, returnToolUses = false) => `
  insertions${getParentIdCondition(parentName)} {
    ${getConstructToolQuery(undefined, relType, returnToolUses)}
  }
`;

// NOTE: this logic assumes this function is only used for Allele and Insertion types
export const getToolSummaryQuery = (typename, relType, returnToolUses = false) => `
  query ToolSummaryQuery($parentId: BigInt!) {
    ${typename === "allele" ? getToolQuery(typename, relType, returnToolUses): ""}
    ${typename === "allele" ? getInsertionToolQuery(typename, relType, returnToolUses): ""}
    ${getConstructToolQuery(typename, relType, returnToolUses)}
  }
`;