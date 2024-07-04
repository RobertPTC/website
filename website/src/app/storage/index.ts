import { FormMoment, Moment } from "app/api/types";

type MomentsRequest = {
  uri: `/api/moments-of-being/moments?year=${string}${string}${string}`;
};

type MomentsNavRequest = {
  uri: "/api/moments-of-being/nav";
};

type CreateMomentsRequest = {
  uri: "/api/moments-of-being/create-moment";
  data: FormMoment;
};

type GetRequests = MomentsRequest | MomentsNavRequest;
type SetRequests = CreateMomentsRequest;

type Resp<T> = {
  ok: boolean;
  json(): Promise<T>;
  statusText: string;
};

interface DataStore {
  get<T>(r: GetRequests): Promise<T | null>;
  set<T extends SetRequests>(
    r: SetRequests
  ): Promise<Resp<T extends CreateMomentsRequest ? Moment : never>>;
  clearCache(): void;
}

let cache: { [key: string]: any } = {};

async function ferryGet<T>(
  { uri }: GetRequests,
  httpClient: typeof fetch
): Promise<T> {
  if (cache[uri]) {
    return Promise.resolve(cache[uri]);
  }
  const res = await httpClient(uri);
  if (!res.ok) {
    throw new Error(`unable to fetch: ${res.status} - ${res.statusText}`);
  }
  const json = await res.json();
  cache[uri] = json;
  return json;
}

async function ferrySet<T>(
  { uri, data }: SetRequests,
  httpClient: typeof fetch
): Promise<Resp<T>> {
  const body = JSON.stringify(data);
  const res = await httpClient(uri, { body, method: "POST" });
  if (!res.ok) {
    throw new Error(`unable to fetch: ${res.status} - ${res.statusText}`);
  }
  return res;
}

function clearCache(uri?: string) {
  if (!uri) {
    cache = {};
    return;
  }
  cache[uri] = null;
}

const Storage = {
  localStorage: (storage: Storage): DataStore => ({
    get: async <T>({ uri }: GetRequests): Promise<T | null> => {
      const value = storage.getItem(uri) as any;
      if (!value) return null;
      if (uri.includes("/")) {
        const pathPieces = uri.split("/");
        const parsed = JSON.parse(value);
        return pathPieces.reduce((p, c) => p[c], parsed);
      }
      return value as any;
    },
    set: async <T>({ uri, data }: SetRequests) => {
      storage.setItem(uri, JSON.stringify(data));
      return { ok: true, json: async () => ({} as any), statusText: "ok" };
    },
    clearCache() {},
  }),
  api: (httpClient: typeof fetch): DataStore => ({
    get: <T>(request: GetRequests) => ferryGet<T>(request, httpClient),
    clearCache: (uri?: string) => clearCache(uri),
    set: <T>(request: SetRequests) => ferrySet<T>(request, httpClient),
  }),
} as const;

export default Storage;
