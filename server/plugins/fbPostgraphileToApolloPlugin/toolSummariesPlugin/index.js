import { makePluginByCombiningPlugins } from 'graphile-utils';
import FBToolSummariesSchemaExtensionPlugin from "./fbToolSummariesSchemeExtensionPlugin";
import FBToolSummariesWrapResolversPlugin from "./fbToolSummariesWrapResolverPlugin";

/*
* This plugin adds the fields found in 'toolSummariesTypeExtensions.graphql'
* to the Allele and Insertion Types.
*
*   NOTE: These fields can be added to other types if needed, simply by extending the
*   type within the FBToolSummariesSchemaExtensionPlugin. No new resolvers need
*   to be written in this case.
*
* See FBToolSummariesWrapResolversPlugin for specifics on each field.
*/

// We combine these two plugins into 1 since they are both necessary for the new
// fields to work. (This is not required, but best practice.)
module.exports = makePluginByCombiningPlugins(
  FBToolSummariesSchemaExtensionPlugin, //Adds new fields to schema
  FBToolSummariesWrapResolversPlugin //Resolves said fields when requested
);