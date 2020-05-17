  /**
   * The values that the collection starts with when initialisied.
   * 
   * @example [{ id: 'c', value: 30 }, { id: 'e', value: 50 }]
   * @example { c: { value: 30 }, e: { value: 50 }}
   * 
   * @default []
   */
export type StartingValues<I extends string | number | symbol, O extends Record<string | number | symbol, any>> = O[] | Record<I, O>;

  /**
   * Additional configuration options that can 
   * (optionally) be passed to the collection during initialisation.
   */
export interface Config<I extends string | number | symbol, O extends Record<string | number | symbol, any>> {
  /**
   * Determines whether the collection is returned to the client-side 
   * as an array or object.
   * 
   * @default 'object'
   */
  transformer?: 'object' | 'array'; 

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
  handleDuplicate?: (value?: O, id?: I) => O | null
  

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
  handleMissing?: (type: 'remove' | 'update', value?: O, id?: I) => O | null
}

export interface Actions<I extends string | number | symbol, O extends Record<string | number | symbol, any>> {
  /**
   * 
   */
  add: (
    newValues: O | O[], 
    target: number | 'start' | 'end' | { before: I } | { after: I },
  ) => void

  /**
   *
   */
  reorder: (
    command: { key: string, direction: 'ascending' | 'descending' } | ((a: { id: I, values: O }, b: { id: I, values: O }) => 0 | 1 | -1)
  ) => void

  /**
   * 
   */
    move: (
      from: number | { id: I },
      to: number | { before: I } | { after: I },
    ) => void;

  /**
   * 
   */
  remove: (
    target: number | { id: I } | ((id: I, values: O) => boolean), 
    amount?: number
  ) => void
      
  /**
   * 
   */
  update: (
    target: number | { id: I }, 
    changes: Partial<O>,
  ) => void;

  /**
   * 
   */
  replace: (newValues: O | O[]) => void;
}
