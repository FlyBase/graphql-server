import { makeWrapResolversPlugin } from 'graphile-utils';
import { getToolUsesRecursive, getToolsRecursive } from './helpers';
import { getToolSummaryQuery, getToolUseQueryForParentType } from './utils';

/*
* Configuration for each summary field.
*
* getQuery: a function returning a GQL query string. Gets passed the parent type's
*     typename, relType, and isToolUseField
* relType: for ToolUse's, the relType value to filter results by
* isToolUseField: true when returning ToolUses, false when returning Tools
*/
const TOOL_SUMMARY_FIELD_INFO = {
    insertedElementTypes: { getQuery: getToolUseQueryForParentType, isToolUseField: true },
    regRegions: { getQuery: getToolSummaryQuery, relType: "has_reg_region", isToolUseField: false },
    alsoCarries: { getQuery: getToolSummaryQuery, relType: "carries_tool", isToolUseField: false },
    taggedWith: { getQuery: getToolSummaryQuery, relType: "tagged_with", isToolUseField: false },
    tagUses: { getQuery: getToolSummaryQuery, relType: "tagged_with", isToolUseField: true },
    encodedTools: { getQuery: getToolSummaryQuery, relType: "encodes_tool", isToolUseField: false },
    encodedToolUses: { getQuery: getToolSummaryQuery, relType: "encodes_tool", isToolUseField: true },
};

/*
* This function is from the 'graphile-utils' library. You can find documentation here:
*     https://www.graphile.org/postgraphile/make-wrap-resolvers-plugin/
* */
module.exports = makeWrapResolversPlugin(
  /*
  * This function is for filtering. Every GQL field will run this function. Returning true
  * will run the following function. In this case, we only want to run the resolver code
  * if we are using one of the fields described in the object above.
  * */
  (context, _build, _field, _options) => {
    const fieldName = context.scope.fieldName;

    if(!Object.keys(TOOL_SUMMARY_FIELD_INFO).includes(fieldName)) return null;

    const typename = context.scope.pgIntrospection.name;

    const { getQuery, relType, isToolUseField } = TOOL_SUMMARY_FIELD_INFO[fieldName];

    const toolUseQuery = getQuery(typename, relType, isToolUseField);

    //These values get passed to the second function
    return { toolUseQuery, isToolUseField, typename, fieldName };
  },
  ({ toolUseQuery, isToolUseField, typename, fieldName }) => ({
    /*
    * By "design", only the fields requested in the query will be accessible from inside the resolver.
    * In our case, we need access to some boolean values which affect what we return in the end.
    *
    * Adding this "requires" object provides the resolver function with the fields' info regardless
    * of if it was requested by the query. These fields will not be added to the response (unless
    * they were requested in the first place).
    *
    * The "alias" string is the name of the key that will be
    * added to the object within the resolver. (I.e. if you put 'alias: "$thisIsAnAlias"', then you can
    * access the field within the resolver as "parent.$thisIsAnAlias"
    * */
    requires: {
      siblingColumns: [
        // Since any type can have these fields added, we need to dynamically require fields based on the parent type
        ...( typename === "allele" ? [{ column: "propagate_transgenic_uses", alias: "$propagateTransgenicUses" }] : ""),
        ...( typename === "allele" ? [{ column: "is_construct", alias: "$isConstruct" }] : ""),
        ...( (typename === "allele" || typename === "insertion") ? [{ column: "id", alias: "$parentId" }] : ""),
      ]
    },
    resolve: async (resolver, parent, args, context, resolveInfo) => {

      let {
        $propagateTransgenicUses = true,
        $isConstruct,
      } = parent;

      /*
        * The __identifiers field represents the value(s) of the primary key(s) for the parent field.
        * For some reason, when querying an object derived from a many-to-many relationship
        * (for example getting "splitSystemCombination => componentAlleles"), __identifiers
        * is not passed into the resolver.
        *
        * In this case, we need to manually require these fields (see above).
        *
        * There may be opportunity for improvement here. It seems like there should be a library-
        * specific method to get the value of an objects primary key, or at least get which key(s)
        * are primary keys. I looked into it for a bit, but didn't want to waste time on it.
        *
        * If we need this sort of behavior on a broader scale in the future, we should look into
        * a slightly more robust solution.
        * */

      const $parentId = parent.__identifiers ? parent.__identifiers[0] : parent["$parentId"];

      // Gain access to the graphql function so that we can execute queries
      const graphql = resolveInfo.graphile.build.graphql.graphql;

      /*
      * Execute a GQL query to get the necessary info
      * NOTE: the graphql function only accepts a string for the query. You cannot
      * simply import a query from a graphql file, or use the gql`` tag.
      */
      let { data, errors } = await graphql(
        resolveInfo.schema,
        toolUseQuery,
        null,
        context,
        { parentId: $parentId }
      );

      if(errors) console.error(errors);

      /*
      * By default, we combine tools/tooluses from nested relationships
      * within alleles, insertions, and constructs.
      *
      * For example, when this is executed for an Allele, it combines the following arrays:
      *   allele.tools
      *   allele.constructs.tools
      *   allele.insertions.constructs.tools
      *
      * If propagateTransgenicUses is false, delete tools/tooluses that are derived
      * from child relationships. (I.e. remove allele.constructs.tools, and
      * allele.insertions.constructs.tools)
      * */
      if(!$propagateTransgenicUses) {
        const responseField = isToolUseField ? "toolUses" : "tools";
        Object.keys(data).forEach(key => {
          if(key !== responseField) delete data[key];
        });
      }

      // Grabs all tool/tooluse arrays within the object and its children fields
      const responseObjects = isToolUseField ? getToolUsesRecursive(data) : getToolsRecursive(data);

      // Alleles that are constructs should use their parent gene as the tool if none other are present for the "encodesTools" field
      if(fieldName === "encodedTools" && responseObjects.length === 0 && typename === "allele" && $isConstruct) {
        /*
        * Postgraphile does not allow you to require sibling fields if they are based on a relationship.
        * For example, you cannot require gene.alleles, or allele.gene.
        *
        * Because of this, we have to make another call to get the parent gene information.
        *
        * Counterintuitively, we query for the allele and return its parent gene, rather than
        * querying for a gene based on its child allele. By default, postgraphile does not
        * provide the ability to filter a parent result by a child property. This is why
        * allele.gene exists, so that the filtering can always happen at the parent level.
        * There are plugins that add this ability, but come at a performance cost since
        * postgraphile itself is not optimized to work in that direction.
        * */
        let { data: geneData, errors: geneErrors } = await graphql(
          resolveInfo.schema,
          `
            query GeneByAllele($parentId: Int!) {
              allele(postgresId: $parentId ) {
                gene {
                  id
                  symbol
                }
              }
            }
          `,
          null,
          context,
          { parentId: $parentId }
        );

        if(geneErrors) console.error(geneErrors);

        return [geneData.allele.gene];
      }

      return responseObjects;
    }
  })
);