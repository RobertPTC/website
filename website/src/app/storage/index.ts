import { FormMoment, Moment, Moments } from "app/api/types";
import { Pomodoro } from "app/features/pomodoro/types";

export type MomentsRequest = {
  uri: `/api/moments-of-being/moments?year=${string}${string}${string}${string}`;
};

export type PomodoroRequest = {
  uri: `/api/pomodoro?year=${string}${string}${string}`;
};

export type MomentsNavRequest = {
  uri: "/api/moments-of-being/nav";
};

export type PomodoroIntentionRequest = {
  uri: "/api/pomodoro-intention";
};

type CreateMomentsRequest = {
  uri: "/api/moments-of-being/create-moment";
  data: FormMoment;
};

export type CreatePomodoroRequest = {
  uri: "/api/pomodoro";
  data: {
    pomodoro: Pomodoro;
    year: string;
    month: string;
    date: string;
    hour: string;
  };
};

type CreatePomodoroIntentionRequest = PomodoroIntentionRequest & {
  data: { intention: string };
};

type GetRequests =
  | MomentsRequest
  | MomentsNavRequest
  | PomodoroRequest
  | PomodoroIntentionRequest;
type SetRequests =
  | CreateMomentsRequest
  | CreatePomodoroRequest
  | CreatePomodoroIntentionRequest;

type Resp<T> = {
  ok: boolean;
  json(): Promise<T>;
  statusText: string;
};

interface DataStore {
  get<T extends GetRequests>(
    r: GetRequests
  ): Promise<
    T extends PomodoroIntentionRequest
      ? string[]
      : T extends MomentsRequest
      ? Moments
      : T extends PomodoroRequest
      ? { [key: string]: Pomodoro[] }
      : null
  >;
  set<T extends SetRequests>(
    r: SetRequests
  ): Promise<
    Resp<
      T extends CreateMomentsRequest
        ? Moment
        : T extends CreatePomodoroRequest
        ? Pomodoro
        : never
    >
  >;
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
    get: async ({ uri }: GetRequests) => {
      const [path, query] = uri.split("?");
      const value = storage.getItem(path);
      if (!value) return null;
      let parsed = JSON.parse(value);
      if (!query) return parsed;
      const queryParams = new URLSearchParams(query);
      for (const value of queryParams.values()) {
        parsed = parsed[value];
      }
      return parsed;
    },
    set: async ({ uri, data }: SetRequests) => {
      let value = storage.getItem(uri);
      if (uri === "/api/pomodoro") {
        const parsed = JSON.parse(value ? value : "{}");
        const { year, month, date, hour, pomodoro } = data;
        let currentPoms = { ...parsed };
        const yearPoms = parsed[year];
        const monthPoms = yearPoms?.[month];
        const datePoms = monthPoms?.[date];
        if (yearPoms && monthPoms && datePoms) {
          currentPoms = {
            ...parsed,
            [year]: {
              ...yearPoms,
              [month]: {
                ...monthPoms,
                [date]: [...datePoms, pomodoro],
              },
            },
          };
        }
        if (yearPoms && monthPoms && !datePoms) {
          currentPoms = {
            ...parsed,
            [year]: {
              ...yearPoms,
              [month]: {
                ...monthPoms,
                [date]: [pomodoro],
              },
            },
          };
        }
        if (yearPoms && !monthPoms) {
          currentPoms = {
            ...parsed,
            [year]: {
              ...yearPoms,
              [month]: {
                [date]: [pomodoro],
              },
            },
          };
        }
        if (!yearPoms) {
          currentPoms = {
            ...parsed,
            [year]: {
              [month]: {
                [date]: [pomodoro],
              },
            },
          };
        }
        storage.setItem(uri, JSON.stringify(currentPoms));
      }
      if (uri === "/api/pomodoro-intention") {
        const value = storage.getItem(uri);
        let newValue: string[] = [];
        if (!value) {
          newValue = [data.intention];
          storage.setItem(uri, JSON.stringify(newValue));
        }
        if (value && !value.includes(data.intention)) {
          const parsed = JSON.parse(value);
          newValue = [...parsed, data.intention];
          storage.setItem(uri, JSON.stringify(newValue));
        }
        return {
          ok: true,
          json: async () => newValue,
          statusText: "ok",
        };
      }
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
