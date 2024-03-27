import TypeDefs from "./toolSummariesTypeExtensions.graphql";
import { makeExtendSchemaPlugin } from "graphile-utils";

// This creates a postgraphile plugin that adds the TypeDefs to the parent's schema
module.exports = makeExtendSchemaPlugin(_ => ({
  typeDefs: [TypeDefs]
}));