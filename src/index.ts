/**
 * Third-party modules
 */

import { useState, useCallback } from 'react';

/*
 * Module internal files
 */

import * as types from './index.types';
import { createAddAction, createReorderAction, createRemoveAction, createMoveAction, createUpdateAction } from './helpers';

/**
 * Primary export
 */

export const useCollection = <I extends string | number | symbol, O extends Record<string | number | symbol, any>>(startingValues: O | O[], config?: types.Config<I, O>) => {
  const { transformer = 'object', identifier = 'id', handleDuplicate } = config || {};

  const startingValuesAsArray = Array.isArray(startingValues) ? startingValues : [startingValues];

  startingValuesAsArray.forEach((object) => {
    if (!(identifier in object)) {
      throw new Error('Identifier (default "id") is not present in all "startingValue"')
    }
  });

  const [collection, setCollection] = useState<O[]>(startingValuesAsArray)

  const replace = useCallback((newValues: O | O[]) => {
    const newValuesAsArray = Array.isArray(newValues) ? newValues : [newValues];
    setCollection(newValuesAsArray);
  }, [collection])


  const actions: types.Actions<I, O> = {
    add: useCallback(createAddAction(collection, setCollection, identifier, handleDuplicate), [collection]),
    move: useCallback(createMoveAction(collection, setCollection, identifier), [collection]),
    remove: useCallback(createRemoveAction(collection, setCollection, identifier), [collection]),
    reorder: useCallback(createReorderAction(collection, setCollection, identifier), [collection]),
    replace: replace,
    update: useCallback(createUpdateAction(collection, setCollection, identifier), [collection]),
  }

  if (transformer === 'object') {
    return [
      collection.reduce(
        (result, object) => ({ ...result, [object.key]: object, }),
        {},
      ),
      actions,
    ] as [Record<I, O>, types.Actions<I, O>]
  }
 
    return [
      collection,
      actions,
    ] as [O[], types.Actions<I, O>]
}

export default useCollection;

