export const createAddAction = <
  I extends string | number | symbol, 
  O extends Record<string | number | symbol, any>
>(
  collection: O[], 
  setCollection: (newValues: O[]) => void,
  identifier: string,
  handleDuplicate?: (value?: O, id?: I) => O | null,
) => {
  return (
    newValues: O | O[], 
    target: number | 'start' | 'end' | { before: I } | { after: I }
  ) => {
    /*
     * Checks if each provided object has the indentifier inside.
     */
  
    const newValuesAsArray = Array.isArray(newValues) ? newValues : [newValues];
  
    newValuesAsArray.forEach((object) => {
      if (!(identifier in object)) {
        throw new Error('Identifier (default "id") is not present in all provided values')
      }
    });
  
    /*
     * Checks if either of indentifier values provided already exists in collection.
     */
  
    const newIds = newValuesAsArray.map(object => object[identifier]) as I[];
  
    collection.forEach((object) => {
      const id = object[identifier];
      const exists = newIds.includes(id);
  
      if (exists && handleDuplicate) {
        handleDuplicate(object, id);
        return;
      }
  
      if (exists) {
        throw (`Identifier ${id} already exists and no "handleDuplicate" was supplied.`)
      }
    })
  
    /*
     * Inserts at index location
     */
  
    if (typeof target === 'number') {
      setCollection([
        ...collection.slice(0, target),
        ...newValuesAsArray,
        ...collection.slice(target),
      ])
  
      return;
    }
    
    /*
     * Inserts at start or end
     */
  
    if (target === 'start') {
      setCollection([...newValuesAsArray, ...collection])
      return;
    }
  
    if (target === 'end') {
      setCollection([...collection, ...newValuesAsArray])
      return;
    }
  
    /*
     * Inserts before or after index of matching indentifier
     */
  
    const targetAsObject = target as { before?: I, after?: I };
    const index = collection.findIndex(object => object[identifier])
  
    if ('before' in targetAsObject) {
      setCollection([
        ...collection.slice(0, index),
        ...newValuesAsArray,
        ...collection.slice(index),
      ])
  
      return;
    }
  
    if ('after' in targetAsObject) {
      setCollection([
        ...collection.slice(0, index + 1),
        ...newValuesAsArray,
        ...collection.slice(index + 1),
      ])
  
      return;
    }
  
    throw new Error('Invalid arguments supplied to "add" action')
  }
}

export default createAddAction;