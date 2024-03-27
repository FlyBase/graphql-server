/*
* Postgraphile appends an @ to the beginning of keys based on a relationship.
* I.e. gene.alleles becomes gene.@alleles. This function returns an object
* stripped of those @ signs.
* */
export const removeAtSignFromKeys = obj => {
  if(Array.isArray(obj)) return obj.map(removeAtSignFromKeys);
  if(obj !== null && typeof obj === "object")
    return Object.fromEntries(
      Object.entries(obj).map(
        ([k,v]) => [k.replace('@',''), removeAtSignFromKeys(v)]
      )
    );
  return obj;
};

export const getToolUsesRecursive = obj => {
  const toolUses = getObjectsByKeyRecursive(obj, "toolUses");
  return (toolUses.length === 1 && toolUses[0] === undefined) ? null : toolUses;
};

export const getToolsRecursive = obj => {
  const tools = getObjectsByKeyRecursive(obj, "tools");
  return (tools.length === 1 && tools[0] === undefined) ? null : tools;
};

/*
* Returns an array of values keyed with the search key at any level of depth.
* Works for any type of input, and recursively searches through objects and arrays.
*
* NOTE: .reduce((a,n) => [...a,...n], []) essentially flattens a 2D array into a 1D array
* NOTE: This function will return [] if searchKey exists within the obj but has 0 total length.
*       It will return [undefined] if the search key doesn't exist at all. This clears confusion
*       of whether an empty array is empty on purpose. It will, however, spit out a false negative
*       in this specific case:
*
*       // searchKey = "foo"
*       { foo: [undefined] } vs { notFoo: [] }
*       // Both will return [undefined]
* */
export const getObjectsByKeyRecursive = (obj, searchKey) => {
  if(Array.isArray(obj))
    return obj.map(item => getObjectsByKeyRecursive(item, searchKey))
              .reduce((a,n) => [...a, ...n], []);
  if(!obj || typeof obj !== "object") return [];

  obj = removeAtSignFromKeys(obj);

  const childObjects =
    Object.keys(obj)
          .filter(key => key !== searchKey) // The values for "searchKey" are handled below
          .map(key => getObjectsByKeyRecursive(obj[key],searchKey))
          .reduce((a,n) => [...a, ...n], []);
  const foundObjects = [
    ...(obj[searchKey] || (childObjects.length === 0 ? [] : [undefined])),
    ...childObjects]
  ;

  const withoutUndefined = foundObjects.filter(item => item !== undefined);

  if(foundObjects.length === 0) return [];
  if(withoutUndefined.length === 0) return [undefined];
  return withoutUndefined;
}