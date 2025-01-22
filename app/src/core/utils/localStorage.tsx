/**
 * Get local storage item with correct type
 *
 * @export
 * @template T
 * @param {keyof ImportMetaEnv} key
 * @return {*}  (T | null)
 */
export function getLocalStorageEnvironmentVariable<K extends keyof ImportMetaEnv>(key: K | null): ImportMetaEnv[K] | null {
    if (!key) return null;
    return localStorage.getItem(key.toString());
}
