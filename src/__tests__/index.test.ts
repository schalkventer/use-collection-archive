/*
 * Third-party modules
 */

import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';

/*
 * Module internal files 
 */

import useCollection from '..';

/*
 * Test assertions 
 */


test('basic', () => {

  /*
   * Creates hook for testing
   */

  const { result } = renderHook(() => useCollection([]));

  expect(true).toEqual(true);
});
