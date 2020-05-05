/*
 * Third-party modules
 */

import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";

/*
 * Module internal files
 */

import useCollection from "..";

/*
 * Test assertions
 */

test("basic", () => {
  /*
   * Creates hook for testing
   */

  const { result } = renderHook(() =>
    useCollection([
      { id: "c", value: 30 },
      { id: "e", value: 50 },
    ])
  );

  expect(result.current[0]).toEqual({
    c: { value: 30, id: "c" },
    e: { id: "e", value: 50 },
  });

  /*
   * Adds items to collection
   */

  act(() => result.current[1].add({ id: "g", value: 70 }, "end"));

  expect(result.current[0]).toEqual({
    c: { id: "c", value: 30 },
    e: { id: "e", value: 50 },
    g: { id: "g", value: 70 },
  });

  act(() =>
    result.current[1].add(
      [
        { id: "a", value: 10 },
        { id: "h", value: 80 },
      ],
      "start"
    )
  );

  expect(result.current[0]).toEqual({
    a: { id: "a", value: 10 },
    h: { id: "h", value: 80 },
    c: { id: "c", value: 30 },
    e: { id: "e", value: 50 },
    g: { id: "g", value: 70 },
  });

  act(() => result.current[1].add({ id: "b", value: 20 }, 1));

  expect(result.current[0]).toEqual({
    a: { id: "a", value: 10 },
    b: { id: "b", value: 20 },
    h: { id: "h", value: 80 },
    c: { id: "c", value: 30 },
    e: { id: "e", value: 50 },
    g: { id: "g", value: 70 },
  });

  act(() => result.current[1].add({ id: "d", value: 40 }, { before: "e" }));

  expect(result.current[0]).toEqual({
    a: { id: "a", value: 10 },
    b: { id: "b", value: 20 },
    h: { id: "h", value: 80 },
    c: { id: "c", value: 30 },
    d: { id: "d", value: 40 },
    e: { id: "e", value: 50 },
    g: { id: "g", value: 70 },
  });

  act(() => result.current[1].add({ id: "f", value: 60 }, { after: "e" }));

  expect(result.current[0]).toEqual({
    a: { id: "a", value: 10 },
    b: { id: "b", value: 20 },
    h: { id: "h", value: 80 },
    c: { id: "c", value: 30 },
    d: { id: "d", value: 40 },
    e: { id: "e", value: 50 },
    f: { id: "f", value: 60 },
    g: { id: "g", value: 70 },
  });

  /*
   * Reorders items in collection
   */

  act(() => result.current[1].reorder({ key: "id", direction: "ascending" }));

  expect(result.current[0]).toEqual({
    a: { id: "a", value: 10 },
    b: { id: "b", value: 20 },
    c: { id: "c", value: 30 },
    d: { id: "d", value: 40 },
    e: { id: "e", value: 50 },
    f: { id: "f", value: 60 },
    g: { id: "g", value: 70 },
    h: { id: "h", value: 80 },
  });

  act(() =>
    result.current[1].reorder({ key: "value", direction: "descending" })
  );

  expect(result.current[0]).toEqual({
    h: { id: "h", value: 80 },
    g: { id: "g", value: 70 },
    f: { id: "f", value: 60 },
    e: { id: "e", value: 50 },
    d: { id: "d", value: 40 },
    c: { id: "c", value: 30 },
    b: { id: "b", value: 20 },
    a: { id: "a", value: 10 },
  });

  act(() =>
    result.current[1].reorder((a, b) => {
      if (a.id === "e") {
        return -1;
      }

      if (a.values.value % 20 === 0) {
        return -1;
      }

      return 0;
    })
  );

  expect(result.current[0]).toEqual({
    e: { id: "e", value: 50 },
    h: { id: "h", value: 80 },
    f: { id: "f", value: 60 },
    d: { id: "d", value: 40 },
    b: { id: "b", value: 20 },
    g: { id: "g", value: 70 },
    c: { id: "c", value: 30 },
    a: { id: "a", value: 10 },
  });

  /*
   * Moves items around in collection
   */

  // act(() =>
  //   result.current[1].move({ id: 'e'}, 4),
  // );

  // expect(result.current[0]).toEqual({
  //   e: { id: "e", value: 50 },
  //   f: { id: "f", value: 60 },
  //   d: { id: "d", value: 40 },
  //   b: { id: "b", value: 20 },
  //   h: { id: "h", value: 80 },
  //   g: { id: "g", value: 70 },
  //   c: { id: "c", value: 30 },
  //   a: { id: "a", value: 10 },
  // });
});
