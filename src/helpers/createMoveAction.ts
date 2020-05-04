/*
 * Embedded helper functions
 */

const calcFromIndex = <I extends string | number | symbol, O extends Record<string | number | symbol, any>>(collection: O[], identifier: string, from: number | { id: I }): number => {
  if (typeof from === 'number') {
    return from;
  }

  return collection.findIndex((object) => object[identifier] === (from as { id: string | number | symbol }).id) as number;
}

const calcToIndex = <I extends string | number | symbol, O extends Record<string | number | symbol, any>>(collection: O[], identifier: string, to: number | { after: I } | { before: I }): number => {
  if (typeof to === 'number') {
    return to;
  }

  const toAsObject = to as { after?: I, before?: I };
  
  if ('before' in toAsObject) {
    return collection.findIndex((object) => object[identifier] === (to as { before: string | number | symbol }).before) as number;
  }
  
  return (collection.findIndex((object) => object[identifier] === (to as { after: string | number | symbol }).after) + 1) as number;
}

/*
 * Primary export
 */

export const createMoveAction = <
  I extends string | number | symbol, 
  O extends Record<string | number | symbol, any>
>(
  collection: O[], 
  setCollection: (newValues: O[]) => void,
  identifier: string,
) => {
  return (from: number | { id: I }, to: number | { before: I } | { after: I }) => {
    const fromIndex = calcFromIndex<I, O>(collection, identifier, from);
    const toIndex = calcToIndex<I, O>(collection, identifier, to);

    if (fromIndex === toIndex) {
      throw new Error('Attempted to move to the same location that item is currently in. This is probably a mistake.')
    }

    const item = collection[fromIndex];

    if (fromIndex < toIndex) {
      const modifiedArray = [
        ...collection.slice(0, fromIndex),
        ...collection.slice(fromIndex + 1),
      ]

      setCollection([
        ...modifiedArray.slice(0, toIndex + 1),
        item,
        ...modifiedArray.slice(toIndex + 1),
      ])
    }

    if (toIndex > fromIndex) {
      const modifiedArray = [
        ...collection.slice(0, fromIndex),
        ...collection.slice(fromIndex + 1),
      ]

      setCollection([
        ...modifiedArray.slice(0, toIndex),
        item,
        ...modifiedArray.slice(toIndex),
      ])
    }

    throw new Error('Invalid arguments passed to "move".')
  }
}

export default createMoveAction;