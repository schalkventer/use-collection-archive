export const createUpdateAction = <
  I extends string | number | symbol, 
  O extends Record<string | number | symbol, any>
>(
  collection: O[], 
  setCollection: (newValues: O[]) => void,
  identifier: string,
) => {
  return (target: number | { id: I }, changes: Partial<O>) => {
    if (typeof target === 'number') {
      const item = collection[target];

      setCollection([
        ...collection.slice(0, target),
        {
          ...item,
          ...changes
        },
        ...collection.slice(target + 1),
      ])

      return;
    }

    const targetAsObject = target as { id: I };
    const index = collection.findIndex((object) => object[identifier] === targetAsObject.id);
    const item = collection[index];

    setCollection([
      ...collection.slice(0, index),
      {
        ...item,
        ...changes
      },
      ...collection.slice(index + 1),
    ])
  };
}

export default createUpdateAction;