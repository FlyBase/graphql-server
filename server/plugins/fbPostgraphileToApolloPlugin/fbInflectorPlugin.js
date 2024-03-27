const { makeAddInflectorsPlugin } = require("graphile-utils");


const getGeneClassKey = key => {
  switch (key) {
    case "name": return "symbol";
    case "uniquename": return "id";
    default: return key;
  }
}

const swapFlybaseIdsAndPostgresIds = key => {
  if(key === "id") return "postgresId";
  if(/^fb(?:\w\w)?id$/i.test(key)) return "id";
  return key;
}


module.exports = makeAddInflectorsPlugin((inflectors) => {
  const {
    column: oldColumn,
    manyRelationByKeysSimple: oldManyRelationByKeysSimple
  } = inflectors;

  return {
    manyRelationByKeysSimple(detailedKeys, table, foreignTable, constraint) {
      const key = oldManyRelationByKeysSimple.call(this, detailedKeys, table, foreignTable, constraint);
      return this.camelCase(key.replace(foreignTable.name, ""));
    },
    column(attr) {
      const key = oldColumn.call(this, attr);

      switch (attr.class.name) {
        case "gene": return getGeneClassKey(key);
        case "pathway_member":
        case "allele_disease_variant": return key;
        default: return swapFlybaseIdsAndPostgresIds(key);
      }

    },
  };
}, true);