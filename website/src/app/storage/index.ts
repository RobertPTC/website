let cache: { [key: string]: any } = {};

async function ferry<T>(
  uri: string,
  init?: RequestInit,
  requests?: typeof fetch
): Promise<T> {
  if (cache[uri]) {
    return Promise.resolve(cache[uri]);
  }
  const res = await fetch(uri, init);
  if (!res.ok) {
    throw new Error(`unable to fetch: ${res.status} - ${res.statusText}`);
  }
  const json = await res.json();
  cache[uri] = json;
  return Promise.resolve(json);
}

function clearCache(uri?: string) {
  if (!uri) {
    cache = {};
    return;
  }
  cache[uri] = null;
}

const Storage = {
  localStorage: (storage: Storage) => ({
    get: async <T>(key: string, path?: string): Promise<T | null> => {
      const value = storage.getItem(key) as any;
      if (!value) return null;
      if (path) {
        const pathPieces = path.split("/");
        const parsed = JSON.parse(value);
        return pathPieces.reduce((p, c) => p[c], parsed);
      }
      return value as any;
    },
    set: (uri: string, data: { [key: string]: any }) => {
      storage.setItem(uri, JSON.stringify(data));
    },
  }),
  api: {
    get: <T>(uri: string, init?: RequestInit) => ferry<T>(uri, init),
    clearCache: (uri?: string) => clearCache(uri),
  },
} as const;

export default Storage;
