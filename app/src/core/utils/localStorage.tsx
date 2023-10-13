/**
 * Get local storage item with correct type
 *
 * @export
 * @template T
 * @param {keyof ImportMetaEnv} key
 * @return {*}  {(T | null)}
 */
export function getLocalStorageEnvironmentVariable<K extends keyof ImportMetaEnv, T = ImportMetaEnv[K]>(key: K | null): T | null {
    return localStorage.getItem(key as string) as T | null;
}
