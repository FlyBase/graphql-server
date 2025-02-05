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
    manyRelationByKeysSimple: oldManyRelationByKeysSimple,
    manyToManyRelationByKeys: oldManyToManyRelationByKeys,
    manyToManyRelationByKeysSimple: oldManyToManyRelationByKeysSimple,
  } = inflectors;

  return {
    manyToManyRelationByKeys(
      _leftKeyAttributes,
      _junctionLeftKeyAttributes,
      _junctionRightKeyAttributes,
      _rightKeyAttributes,
      _junctionTable,
      rightTable,
      _junctionLeftConstraint,
      junctionRightConstraint
    ) {

      if(_junctionTable.name === "split_system_combination_component_allele" && rightTable.name === "allele") {
        return "componentAllelesConnection";
      }

      return oldManyToManyRelationByKeys.call(this, _leftKeyAttributes,
        _junctionLeftKeyAttributes,
        _junctionRightKeyAttributes,
        _rightKeyAttributes,
        _junctionTable,
        rightTable,
        _junctionLeftConstraint,
        junctionRightConstraint);
    },
    manyToManyRelationByKeysSimple(
      _leftKeyAttributes,
      _junctionLeftKeyAttributes,
      _junctionRightKeyAttributes,
      _rightKeyAttributes,
      _junctionTable,
      rightTable,
      _junctionLeftConstraint,
      junctionRightConstraint
    ) {
      if(_junctionTable.name === "split_system_combination_component_allele" && rightTable.name === "allele") {
        return "componentAlleles";
      }

      return oldManyToManyRelationByKeysSimple.call(this, _leftKeyAttributes,
        _junctionLeftKeyAttributes,
        _junctionRightKeyAttributes,
        _rightKeyAttributes,
        _junctionTable,
        rightTable,
        _junctionLeftConstraint,
        junctionRightConstraint);
    },
    manyRelationByKeysSimple(detailedKeys, table, foreignTable, constraint) {
      const key = oldManyRelationByKeysSimple.call(this, detailedKeys, table, foreignTable, constraint);

      return this.camelCase(key.replace(foreignTable.name, ""));
    },
    column(attr) {
      const key = oldColumn.call(this, attr);

      if(attr.class.namespaceName === "dataclass" || attr.class.namespaceName === "dataclass_relationship") {
        return key;
      }

      switch (attr.class.name) {
        case "gene": return getGeneClassKey(key);
        case "pathway_member":
        case "allele_disease_variant": return key;
        default: return swapFlybaseIdsAndPostgresIds(key);
      }

    },
  };
}, true);
