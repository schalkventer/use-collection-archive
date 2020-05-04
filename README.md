# 🤹‍♂️ Use Collection

A single React hook for managing objects/arrays within your components.

- [Arguments](#shape)
- [Basic usage](#basic-usage)
- [TypeScript usage](#typescript-usage)

## BArguments

**Default configurations** 

_Note that if you are using TypeScript you can pass the following generics:_

- _`I`: The unique identifier type_
- _`O`: the expected shape of the objects inside the collection (the specified identifier key is added automatically)_

### Actions

#### Add

```ts
  (
    newValues: O | O[], 
    target: number | 'start' | 'end' | { before: I } | { after: I }
  ) => void
```

#### Reorder

```ts
  (
    command: { id: I, direction: 'ascending' | 'descending' } | (a: [I, O], b: [I, O]) => 0 | 1 | -1;
  ) => void
```

#### Move

```ts
  (
    from: number | { id: I },
    to: number | { before: I } | { after: I }
  ) => void;
    
```

#### Remove

```ts
  (
    target: number | { id: I } | (id: I, value: O) => void;
    amount?: number
  ) => void
```

#### Update

```ts
  (
    target: number | { id: I }, 
    changes: Partial<O>,
  ) => void;
```

#### Replace

```ts
  (newValues:? O[]) => void;
```

### Initialise:

```ts
useCollection<I extends string | number | symbol, O extends Record<I, O>>(
  /**
   * The values that the collection starts with when intialisied.
   * 
   * @example [{ id: 'c', value: 30 }, { id: 'e', value: 50 }]
   * @example { c: { value: 30 }, e: { value: 50 }}
   * 
   * @default []
   */
  collection: O[] | Record<I, O>,

  /**
   * Additional configuration options that can 
   * (optionally) be passed to the collection during initialisation.
   */
  config?: {
    /**
     * Determines whether the collection is returned to the client-side 
     * as an array or object.
     * 
     * @default 'object'
     */
    transformer: 'object' | 'array' | (id, value) => any; 

    /**
     * Designates the unique identifier key that is used in the collection.
     * 
     * @default 'id'
     */
    identifier?: string;

    /**
     * Automatically creates an UUID as an identifier when an 
     * item is added without the identifier key.
     * 
     * @default false
     */
    autoId?: boolean;

    /**
     * A handler that catches the error thrown when you are adding an item 
     * that already exists in the collection. The returned object 
     * from the function is then used instead.
     * 
     * Note that if `null` is returned nothing happens.
     * 
     * @example: (type, value, id) => {
     *  if (type === 'exists') {
     *    return {
     *       ...value,
     *       id: `${id}-${new Date().getTime()})`
     *    }
     *  }
     * }
     */
    handleDuplicate: (value?: O, id?: I) => O | null
    

    /**
     * A handler that catches the error thrown when you are trying to
     * update/remove and item that does not exist. The returned id is 
     * then used instead.
     * 
     * Note that if `null` is returned then nothing happens.
     * 
     * @example: (type, value, id) => {
     *  if (type === 'remove') {
     *    return /\w+/(?=\-)/i.replace('');
     *  }
     */
    handleMissing?: (type: 'remove' | 'update' type value?: O, id?: I) => O | null
  }
)
```

## Basic usage:

```js
import { useCollection } from 'useCollection';

const startingCollection = [{ id: 'c', value: 30 }, { id: 'e', value: 50 }];
const [collection, collectionActions] = useCollection(startingCollection) /* { c: 30, e: 50 } */


collectionActions.add({ id: 'g', value: 70 }, 'end'); 

/* 
 * { 
 *   c: { value: 30 }, 
 *   e: { value: 50 }, 
 *   g: { value: 70 }
 * } 
 */


collectionActions.add(
  [{ id: 'a', value: 10 }, { id: 'h', 80 }], 
  'start'
); 

/* 
 * { 
 *   a: { value: 10 },
 *   h: { value: 80 }
 *   c: { value: 30 }, 
 *   e: { value: 50 }, 
 *   g: { value: 70 }
 * } 
 */


collectionActions.add(
  { id: 'b', value: 20 }, 
  1
); 

/* 
 * { 
 *   a: { value: 10 },
 *   b: { value: 20 }
 *   h: { value: 80 }
 *   c: { value: 30 }, 
 *   e: { value: 50 }, 
 *   g: { value: 70 }
 * } 
 */


collectionActions.add(
  { id: 'd', value: 40 }, 
  { before: 'e' }
); 

/* 
 * { 
 *   a: { value: 10 },
 *   b: { value: 20 }
 *   h: { value: 80 }
 *   c: { value: 30 }, 
 *   d: { value: 40 }, 
 *   e: { value: 50 }, 
 *   g: { value: 70 }
 * } 
 */


collectionActions.add(
  { id: 'f', value: 60 }, 
  { after: 'e' }
);

/* 
 * { 
 *   a: { value: 10 },
 *   b: { value: 20 }
 *   h: { value: 80 }
 *   c: { value: 30 }, 
 *   d: { value: 40 }, 
 *   e: { value: 50 }, 
 *   f: { value: 60 }, 
 *   g: { value: 70 }
 * } 
 */


collectionActions.reorder('id', 'ascending');

/* 
 * { 
 *   a: { value: 10 },
 *   b: { value: 20 }
 *   c: { value: 30 }, 
 *   d: { value: 40 }, 
 *   e: { value: 50 }, 
 *   f: { value: 60 }, 
 *   g: { value: 70 }
 *   h: { value: 80 }
 * } 
 */


collectionActions.reorder('value', 'descending');

/* 
 * { 
 *   h: { value: 80 }
 *   g: { value: 70 }
 *   f: { value: 60 }, 
 *   e: { value: 50 }, 
 *   d: { value: 40 }, 
 *   c: { value: 30 }, 
 *   b: { value: 20 }
 *   a: { value: 10 },
 * } 
 */


collectionActions.reorder((a, b) => {
  if (a.id === 'e') {
    return -1;
  }

  if (a.value % 20 === 0) {
    return -1;
  }

  return 0;
}));

/* 
 * { 
 *   e: { value: 50 }
 *   h: { value: 80 }, 
 *   f: { value: 60 }, 
 *   d: { value: 40 }, 
 *   b: { value: 20 }, 
 *   g: { value: 70 }
 *   c: { value: 30 },
 *   a: { value: 10 },
 * } 
 */


collectionActions.move({ id: 'e'}, {index: 4 })

/* 
 * { 
 *   e: { value: 50 }
 *   f: { value: 60 }, 
 *   d: { value: 40 }, 
 *   b: { value: 20 }, 
 *   h: { value: 80 }, 
 *   g: { value: 70 }
 *   c: { value: 30 },
 *   a: { value: 10 },
 * } 
 */


collectionActions.move(2, { before: 'f' }); 

/* 
 * { 
 *   e: { value: 50 }
 *   d: { value: 40 }, 
 *   f: { value: 60 }, 
 *   b: { value: 20 }, 
 *   h: { value: 80 }, 
 *   g: { value: 70 }
 *   c: { value: 30 },
 *   a: { value: 10 },
 * } 
 */


collectionActions.remove(1);

/* 
 * { 
 *   e: { value: 50 }
 *   f: { value: 60 }, 
 *   b: { value: 20 }, 
 *   h: { value: 80 }, 
 *   g: { value: 70 }
 *   c: { value: 30 },
 *   a: { value: 10 },
 * } 
 */


collectionActions.remove({ id: 'c' });

/* 
 * { 
 *   e: { value: 50 }
 *   f: { value: 60 }, 
 *   b: { value: 20 }, 
 *   h: { value: 80 }, 
 *   g: { value: 70 },
 *   a: { value: 10 },
 * } 
 */


collectionActions.remove(([ , value ]) => value % 20 === 0, 1); 

/* 
 * {
 *  c: { value: 30 },
 *  d: { value: 40 },
 *  e: { value: 50 },
 *  g: { value: 70 }
 * }
 */


collectionActions.remove(
  ([ id, value ]) => {
    if (id === 70) {
      return false;
    }

    if (value % 2 === 0) {
      return false;
    }

    return true;
  },
);

/* 
 * {
 *  d: { value: 40 },
 *  g: { value: 70 }
 * }
 */


collectionActions.update(
  1, 
  { value: 99, additional: 'Hello World!' },
); 

/* 
 * {
 *  d: { value: 40 },
 *  g: { value: 99, additional: 'Hello World!' }
 * }
 */


collectionActions.update(
  { id: 'g' }, 
  { value: 3 },
); 

/* 
 * {
 *  d: { value: 40 },
 *  g: { value: 3, additional: 'Hello World!' }
 * }
 */


collectionActions.update(
  0
  { anotherAdditional: 'Lorem Ipsum' },
); 

/* 
 * {
 *  d: { value: 40, anotherAdditional: 'Lorem Ipsum' },
 *  g: { value: 99, additional: 'Hello World!' }
 * }
 */

collectionActions.replace()

/*
 * {}
 */


collectionActions.replace({ john { age: 6 }, sarah: { age: 32 }); 

/* 
 * {
 *  d: { value: 40, anotherAdditional: 'Lorem Ipsum' },
 *  g: { value: 99, additional: 'Hello World!' }
 * }
 */


collectionActions.replace(startingCollection);

/* 
 * {
 *  c: { value: 30 },
 *  e: { value: 50 }
 * }
 */
```

## TypeScript usage

```ts
import { useCollection, Array, Object, Actions, Props } from 'useCollection';

interface Item {
  /**
   * A unique id (UUID) that is assigned to a specific item in this collection.
   *
   * @example '668d6dd0-e154-4114-ad84-6bb2f6b5581b'
   */
  id: string;

  /**
   * The title assigned to a specific user alert. This is a short summary of what
   * you are trying to communicate and should not be longer than about 6 words in
   * length. Rather use the `message` value to provide more context.
   *
   * @example 'Access denied'
   * @example 'Redirecting to homepage'
   * @example 'Image uploaded'
   * @example 'Something went wrong!'
   */
  title: string;

  /**
   * The nature of the alert. This influences the manner in which the alert is
   * displayed when consumed by an `<Alerts />` component.
   *
   * - `'info'` should generally be used to provide the user with
   *   additional/non-critical information. For example if they entered an
   *   incorrect password several times an info alert might appear that says
   *   something along the lines of 'If you have forgotten or are unsure what your
   *   login details are you can contact info@domain.com for assistance.'
   *
   * - `'warning'` is surfaced to a user when an anticipated/pre-defined error
   *   state is triggered. For example when a user enters an incorrect value or if
   *   they do not have permission to perform a specific task. Warnings can either
   *   block a user from performing and action or allow them to proceed as long as
   *   they are aware of the implications.
   *
   * - `'error'` should only be reserved for unexpected fail-states or errors that
   *   are not considered as part of the expected user flow. These usually have a
   *   technical aspect to them and advise users to try again and/or contact the
   *   support team. A common example where an error alert would be used is if the
   *   server returns a `404` HTTP status.
   *
   * - `'success'` should be used to indicate actions that have been performed
   *   successfully. According to the principles of [an optimistic
   *   UI](smashingmagazine.com/2016/11/true-lies-of-optimistic-user-interfaces/)
   *   the UI can update accordingly while the action is busy resolving, but a
   *   success alert can only fire once the response actually resolves, cementing
   *   the notion that the action actually did succeed (while not
   *   hampering/blocking the user-flow).
   *
   * - `'resolving'` should be used when you want to indicate to a user that an
   *   action is being performed but the end-state of the action is still unknown.
   *   For example you can surface a resolving alert while data is being uploaded.
   *   Once you know whether the data has been uploaded successfully (or failed)
   *   you can update the type accordingly. Note that when consumed by the
   *   `<Alerts />` component it will display a spinner instead of an icon in the
   *   alert.
   */
  type: 'info' | 'warning' | 'error' | 'success' | 'resolving';

  /**
   * An optional message that can be included alongside the alert's `title`. This
   * can provide more context on what exactly happened or provide
   * instructions/next steps to the user.
   *
   * @example 'Please try again. If the issue persists please contact our support
   * team.'
   *
   * @example 'The information provided is incorrect, please confirm that you have
   * entered the correct email and password.'
   *
   * @example 'One of the fields are empty. Please add all required data before
   * proceeding.'
   *
   * @example 'To access this information again later please visit your account
   * section.'
   */
  message: string | null;
}

const [collection, collectionActions] = useCollection<string, Item>([], { autoId: true }) 
```
