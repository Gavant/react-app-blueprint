/**
 * Generic type guard
 *
 * @template T
 * @param {*} itemToCheck
 * @param {(Array<keyof T> | keyof T)} propertyNames
 * @returns {itemToCheck is T}
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
 * @return {*}  {itemToCheck is T[]}
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
 * @return {*}  {T[]}
 */
export const flattenEnum = <T>(e: any): T[] => {
    return Object.values(e).filter((value) => typeof value === 'string') as T[];
};
