export const createReorderAction = <
  I extends string | number | symbol, 
  O extends Record<string | number | symbol, any>
>(
  collection: O[], 
  setCollection: (newValues: O[]) => void,
  identifier: string,
) => {
  return (command: { key: string, direction: 'ascending' | 'descending' } | ((a: { id: I, values: O }, b: { id: I, values: O }) => 0 | 1 | -1)) => {
    /*
     * Checks if command is function 
     */
  
    if (typeof command === 'function') {
      const commandAsFunction = command as (a: { id: I, values: O }, b: { id: I, values: O }) => 0 | 1 | -1;
      const sortWrapper = (a: O, b: O) => commandAsFunction({ id: a[identifier], values: a }, { id: b[identifier], values: b });
        
      setCollection(collection.sort(sortWrapper));
      return;
    }
  
    /*
     * Infers that command is an object 
     */
  
    const commandAsObject = command as { key: string, direction: 'ascending' | 'descending' };
    const { key, direction } = command;

    const result = collection.sort((a, b) => {
      if (typeof a[key] === 'string') {
        return a[key].localeCompare(b[key])
      }

      if (a < b) {
        return -1;
      }

      if (a > b) {
        return 1;
      }

      return 0;
    })
  
    if (direction === 'ascending') {
      setCollection(result);
      return;
    }
  
    setCollection(result.reverse())
  }
}

export default createReorderAction;




