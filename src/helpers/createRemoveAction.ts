export const createRemoveAction = <
  I extends string | number | symbol, 
  O extends Record<string | number | symbol, any>
>(
  collection: O[], 
  setCollection: (newValues: O[]) => void,
  identifier: string,
) => {
  return (target: number | { id: I } | ((id: I, values: O) => boolean), amount?: number): void => {
    if (typeof target === 'number') {
      setCollection([
        ...collection.slice(0, target),
        ...collection.slice(target + 1),
      ])

      return;
    }
  
    if (typeof target !== 'function') {
      const targetAsObject = target as { id: string | number | symbol };
      const result = collection.filter((object) => object[identifier] !== targetAsObject.id)
      setCollection(result);
      return;
    }
  
    let counter = 0;
    
    const callbackWrapper = (values: O) => {
      const targetAsFunction = target as (id: I, values: O) => boolean;
  
      if (amount && counter >= amount) {
        return values;
      }
      
      if (targetAsFunction(values[identifier], values)) {
        counter += 1;
        return null;
      }
  
      return values;
    }
  
    const result = collection.map(callbackWrapper).filter(value => !!value) as O[];
    setCollection(result);
  }
}

export default createRemoveAction;
