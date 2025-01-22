/**
 * Generic type guard
 *
 * @template T
 * @param {*} itemToCheck
 * @param {(Array<keyof T> | keyof T)} propertyNames
 * @returns {*} itemToCheck is T
 */
export const guard = <T extends object>(itemToCheck: any, propertyNames: Array<keyof T> | keyof T): itemToCheck is T => {
    return Array.isArray(propertyNames)
        ? Object.keys(itemToCheck as T).some((key) => propertyNames.indexOf(key as keyof T) >= 0)
        : (itemToCheck as T)[propertyNames as keyof T] !== undefined;
};

/**
 *
 *
 * @template T
 * @param {any[]} itemToCheck
 * @param {(Array<keyof T> | keyof T)} propertyNames
 * @return {*} itemToCheck is T[]
 */
export const isArrayOf = <T extends object>(itemToCheck: any[], propertyNames: Array<keyof T> | keyof T): itemToCheck is T[] => {
    return itemToCheck.some((item) => guard<T>(item, propertyNames));
};

/**
 * Pluck - allows you to pick one / multiple properties from one object
 *
 * @template T
 * @template K
 * @param {T} o
 * @param {(K[] | K)} propertyNames
 * @returns {(T[K][] | T[K])}
 */
export const pluck = <T, K extends keyof T>(o: T, propertyNames: K | K[]): T[K] | T[K][] => {
    return Array.isArray(propertyNames) ? propertyNames.map((n) => o[n]) : o[propertyNames];
};

/**
 * Flatten enum to get array of enum values
 *
 * @template T
 * @param {T} e
 * @return {*} T[]
 */
export const flattenEnum = <T>(e: any): T[] => {
    return Object.values(e).filter((value) => typeof value === 'string') as T[];
};

export type ArrayMemberType<T> = T extends Array<infer U> ? U : never;

export type DeepPartial<T> = T extends object
    ? {
          [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;

export type ElementProps<T> = T extends React.ComponentType<infer Props> ? (Props extends object ? Props : never) : never;

/**
 * Get all keys of an object that have a specific value type
 *
 */
export type KeyOfType<T, V> = keyof {
    [P in keyof T as T[P] extends V ? P : never]: any;
};

export type OmitTypename<T> = Omit<T, '__typename'>;
