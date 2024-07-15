import { FormMoment, Moment, MomentNav, Moments } from "app/api/types";
import { Pomodoro, PomodoroInput } from "app/features/pomodoro/types";

// Pomodoros
export type PomodorosForMonthRequest = {
  uri: `/api/pomodoro?year=${number}&month=${number}`;
};

export type PomodorosForDateRequest = {
  uri: `/api/pomodoro?year=${number}&month=${number}&date=${number}`;
};

export type AllPomodorosRequest = {
  uri: `/api/pomodoro`;
};

export type CreatePomodoroRequest = {
  uri: "/api/pomodoro";
  data: {
    pomodoros: PomodoroInput[];
  };
};

export type DeletePomodoroRequest = {
  uri: "/api/pomodoro/delete/intention";
  data: {
    intention: string;
  };
};

export type PomodoroIntentionRequest = {
  uri: "/api/pomodoro-intention";
};

export type CreatePomodoroIntentionRequest = PomodoroIntentionRequest & {
  data: { intention: string };
};

export type PomodorosForHour = Pomodoro[];

export type PomodorosForDate = {
  [key: string]: PomodorosForHour;
};

export type PomodorosForMonth = {
  [key: string]: PomodorosForDate;
};

type PomodorosForYear = {
  [key: string]: PomodorosForMonth;
};

export type AllPomodoros = {
  [key: string]: PomodorosForYear;
};

// Moments
export type MomentsRequest = {
  uri: `/api/moments-of-being/moments?year=${string}${string}${string}${string}`;
};

export type MomentsNavRequest = {
  uri: "/api/moments-of-being/nav";
};

export type CreateMomentRequest = {
  uri: "/api/moments-of-being/create-moment";
  data: FormMoment;
};

type GetRequests =
  | MomentsRequest
  | MomentsNavRequest
  | PomodorosForMonthRequest
  | PomodoroIntentionRequest
  | PomodorosForDateRequest
  | AllPomodorosRequest;
type SetRequests =
  | CreateMomentRequest
  | CreatePomodoroRequest
  | CreatePomodoroIntentionRequest;

type DeleteRequests = DeletePomodoroRequest;

interface DataStore {
  get<T extends GetRequests>(
    r: T
  ): Promise<
    T extends PomodoroIntentionRequest
      ? string[]
      : T extends MomentsRequest
      ? Moments
      : T extends PomodorosForMonthRequest
      ? PomodorosForMonth
      : T extends PomodorosForDateRequest
      ? PomodorosForDate
      : T extends AllPomodorosRequest
      ? AllPomodoros
      : T extends MomentsNavRequest
      ? MomentNav
      : null
  >;
  set<T extends SetRequests>(
    r: T
  ): Promise<
    T extends CreateMomentRequest
      ? Moment
      : T extends CreatePomodoroRequest
      ? Pomodoro[]
      : T extends CreatePomodoroIntentionRequest
      ? string
      : null
  >;
  delete(r: DeleteRequests): Promise<void>;
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
): Promise<T> {
  const body = JSON.stringify(data);
  const res = await httpClient(uri, { body, method: "POST" });
  if (!res.ok) {
    throw new Error(`unable to fetch: ${res.status} - ${res.statusText}`);
  }
  return await res.json();
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
      const copy = { ...parsed };
      if (!query) return parsed;
      const queryParams = new URLSearchParams(query);
      for (const value of queryParams.values()) {
        try {
          parsed = parsed[value];
        } catch (e) {
          throw new Error(`${value} does not exist in ${JSON.stringify(copy)}`);
        }
      }
      return parsed;
    },
    set: async ({ uri, data }: SetRequests) => {
      let value = storage.getItem(uri);
      if (uri === "/api/pomodoro") {
        const parsed: Partial<AllPomodoros> = JSON.parse(value ? value : "{}");
        const { pomodoros } = data;
        let currentPoms = { ...parsed };

        const newPomodoros = pomodoros.reduce((p, c) => {
          const { year, month, date, hour } = c;
          const yearPoms = p[year];
          const monthPoms = yearPoms?.[month];
          const datePoms = monthPoms?.[date];
          const hourPoms = datePoms?.[hour];
          const pomodoro = { label: c.label, id: c.id, seconds: c.seconds };
          if (!yearPoms) {
            return {
              ...p,
              [year]: {
                [month]: {
                  [date]: { [hour]: [pomodoro] },
                },
              },
            };
          }

          if (monthPoms && datePoms && hourPoms) {
            return {
              ...p,
              [year]: {
                ...yearPoms,
                [month]: {
                  ...monthPoms,
                  [date]: {
                    ...datePoms,
                    [hour]: [...hourPoms, pomodoro],
                  },
                },
              },
            };
          }

          if (monthPoms && datePoms) {
            return {
              ...p,
              [year]: {
                ...yearPoms,
                [month]: {
                  ...monthPoms,
                  [date]: { ...datePoms, [hour]: [pomodoro] },
                },
              },
            };
          }

          if (monthPoms) {
            return {
              ...p,
              [year]: {
                ...yearPoms,
                [month]: {
                  ...monthPoms,
                  [date]: { [hour]: [pomodoro] },
                },
              },
            };
          }
          return p;
        }, currentPoms);

        storage.setItem(uri, JSON.stringify(newPomodoros));
        return pomodoros as any;
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
        return newValue;
      }
      return null;
    },
    clearCache() {
      storage.clear();
    },
    delete: async ({ uri, data }: DeleteRequests) => {
      const lS = Storage["localStorage"](storage);
      if (uri === "/api/pomodoro/delete/intention") {
        const { intention } = data;
        const pomodoros = await lS.get<AllPomodorosRequest>({
          uri: "/api/pomodoro",
        });
        const pomodoroIntentions = await lS.get<PomodoroIntentionRequest>({
          uri: "/api/pomodoro-intention",
        });
        const newPomodoroIntentions = (pomodoroIntentions || []).filter(
          (p) => p !== intention
        );
        if (pomodoros) {
          Object.keys(pomodoros).forEach((year) => {
            Object.keys(pomodoros[year]).forEach((month) => {
              Object.keys(pomodoros[year][month]).forEach((date) => {
                Object.keys(pomodoros[year][month][date]).forEach((hour) => {
                  const newPomodoros = pomodoros[year][month][date][
                    hour
                  ].filter((p: Pomodoro) => {
                    return p.label !== intention;
                  });
                  pomodoros[year][month][date][hour] = newPomodoros;
                  if (!newPomodoros.length) {
                    delete pomodoros[year][month][date];
                  }
                  if (!Object.keys(pomodoros[year][month]).length) {
                    delete pomodoros[year][month];
                  }
                  if (!Object.keys(pomodoros[year]).length) {
                    delete pomodoros[year];
                  }
                });
              });
            });
          });
        }
        if (!newPomodoroIntentions.length) {
          storage.removeItem("/api/pomodoro");
          storage.removeItem("/api/pomodoro-intention");
          return;
        }
        if (newPomodoroIntentions.length && !Object.keys(pomodoros).length) {
          storage.setItem(
            "/api/pomodoro-intention",
            JSON.stringify(newPomodoroIntentions)
          );
          storage.removeItem("/api/pomodoro");
          return;
        }
        storage.setItem("/api/pomodoro", JSON.stringify(pomodoros));
        storage.setItem(
          "/api/pomodoro-intention",
          JSON.stringify(newPomodoroIntentions)
        );
      }
    },
  }),
  api: (httpClient: typeof fetch): DataStore => ({
    get: (request: GetRequests) => ferryGet(request, httpClient),
    clearCache: (uri?: string) => clearCache(uri),
    set: (request: SetRequests) => ferrySet(request, httpClient),
    delete: function <T extends DeleteRequests>(
      r: DeleteRequests
    ): Promise<void> {
      throw new Error("Function not implemented.");
    },
  }),
} as const;

export default Storage;
