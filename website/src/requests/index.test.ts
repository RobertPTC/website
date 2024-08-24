import Requests, { AllPomodorosRequest } from ".";

let storage: { [key: string]: any } = {};

const mockLocalStorage: Storage = {
  getItem(key) {
    return storage[key];
  },
  length: 0,
  clear: function (): void {
    storage = {};
  },
  key: function (index: number): string | null {
    throw new Error("Function not implemented.");
  },
  removeItem: function (key: string): void {
    throw new Error("Function not implemented.");
  },
  setItem: function (key: string, value: string): void {
    storage[key] = value;
  },
};

describe("Storage", () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });
  it("sets data in local storage from initially empty data storage", async () => {
    const localStorage = Requests["localStorage"](mockLocalStorage);
    await localStorage.set({
      uri: "/api/pomodoro",
      data: {
        pomodoros: [
          {
            label: "hi",
            seconds: 60,
            id: "0",
            year: 2024,
            date: 3,
            month: 6,
            hour: 12,
          },
        ],
      },
    });
    const data = await localStorage.get({
      uri: "/api/pomodoro?year=2024&month=6&date=3",
    });
    expect(data).toStrictEqual({
      "12": [{ label: "hi", seconds: 60, id: "0" }],
    });
  });
  it("sets data in local storage when date is initially empty", async () => {
    const localStorage = Requests["localStorage"](mockLocalStorage);
    await localStorage.set({
      uri: "/api/pomodoro",
      data: {
        pomodoros: [
          {
            year: 2024,
            date: 3,
            month: 6,
            hour: 12,
            label: "hi",
            seconds: 60,
            id: "0",
          },
        ],
      },
    });
    await localStorage.set({
      uri: "/api/pomodoro",
      data: {
        pomodoros: [
          {
            label: "hi",
            seconds: 60,
            id: "20240604",
            year: 2024,
            date: 4,
            month: 6,
            hour: 12,
          },
        ],
      },
    });
    const data = await localStorage.get({
      uri: "/api/pomodoro",
    });
    expect(data).toStrictEqual({
      "2024": {
        "6": {
          "3": {
            "12": [{ label: "hi", seconds: 60, id: "0" }],
          },
          "4": {
            "12": [
              {
                label: "hi",
                seconds: 60,
                id: "20240604",
              },
            ],
          },
        },
      },
    });
  });
  it("sets data in local storage when times are the same", async () => {
    const localStorage = Requests["localStorage"](mockLocalStorage);
    await localStorage.set({
      uri: "/api/pomodoro",
      data: {
        pomodoros: [
          {
            year: 2024,
            date: 4,
            month: 6,
            hour: 12,
            label: "hi",
            seconds: 60,
            id: "0",
          },
          {
            label: "hi",
            seconds: 60,
            id: "20240604",
            year: 2024,
            date: 4,
            month: 6,
            hour: 12,
          },
        ],
      },
    });

    const data = await localStorage.get({
      uri: "/api/pomodoro",
    });
    expect(data).toStrictEqual({
      "2024": {
        "6": {
          "4": {
            "12": [
              { label: "hi", seconds: 60, id: "0" },
              {
                label: "hi",
                seconds: 60,
                id: "20240604",
              },
            ],
          },
        },
      },
    });
  });
  it("sets data in local storage when hours are different", async () => {
    const localStorage = Requests["localStorage"](mockLocalStorage);
    await localStorage.set({
      uri: "/api/pomodoro",
      data: {
        pomodoros: [
          {
            label: "hi",
            seconds: 60,
            id: "0",
            year: 2024,
            date: 3,
            month: 6,
            hour: 12,
          },
          {
            label: "hi",
            seconds: 60,
            id: "20240704",
            year: 2024,
            date: 3,
            month: 6,
            hour: 13,
          },
        ],
      },
    });

    const data = await localStorage.get<AllPomodorosRequest>({
      uri: "/api/pomodoro",
    });
    expect(data).toStrictEqual({
      "2024": {
        "6": {
          "3": {
            "12": [{ label: "hi", seconds: 60, id: "0" }],
            "13": [
              {
                label: "hi",
                seconds: 60,
                id: "20240704",
              },
            ],
          },
        },
      },
    });
  });
  it("sets data in local storage when date is different", async () => {
    const localStorage = Requests["localStorage"](mockLocalStorage);
    await localStorage.set({
      uri: "/api/pomodoro",
      data: {
        pomodoros: [
          {
            label: "hi",
            seconds: 60,
            id: "0",
            year: 2024,
            date: 4,
            month: 6,
            hour: 12,
          },
          {
            label: "hi",
            seconds: 60,
            id: "20240704",
            year: 2024,
            date: 3,
            month: 6,
            hour: 13,
          },
        ],
      },
    });

    const data = await localStorage.get<AllPomodorosRequest>({
      uri: "/api/pomodoro",
    });
    expect(data).toStrictEqual({
      "2024": {
        "6": {
          "4": {
            "12": [{ label: "hi", seconds: 60, id: "0" }],
          },
          "3": {
            "13": [
              {
                label: "hi",
                seconds: 60,
                id: "20240704",
              },
            ],
          },
        },
      },
    });
  });

  it("deletes pomodoros from local storage 2", async () => {
    const localStorage = Requests["localStorage"](mockLocalStorage);
    await localStorage.set({
      uri: "/api/pomodoro-intention",
      data: {
        intention: "foo",
      },
    });
    await localStorage.set({
      uri: "/api/pomodoro-intention",
      data: {
        intention: "bar",
      },
    });
    await localStorage.set({
      uri: "/api/pomodoro",
      data: {
        pomodoros: [
          {
            year: 2024,
            month: 6,
            date: 18,
            hour: 22,
            label: "programming",
            id: "f7b85e59-9036-4d24-8b74-fa6c9268b21b",
            seconds: 10,
          },
          {
            year: 2024,
            month: 6,
            date: 18,
            hour: 22,
            label: "writing",
            id: "375bb4f7-a526-46fd-929c-b0fb479dbcc0",
            seconds: 2,
          },
        ],
      },
    });
    await localStorage.delete({
      uri: "/api/pomodoro/delete/intention",
      data: { intention: "writing" },
    });
    const pomodoros = await localStorage.get({ uri: "/api/pomodoro" });
    expect(pomodoros).toStrictEqual({
      2024: {
        6: {
          18: {
            22: [
              {
                label: "programming",
                seconds: 10,
                id: "f7b85e59-9036-4d24-8b74-fa6c9268b21b",
              },
            ],
          },
        },
      },
    });
  });
  it("deletes pomodoros from local storage", async () => {
    const localStorage = Requests["localStorage"](mockLocalStorage);
    await localStorage.set({
      uri: "/api/pomodoro-intention",
      data: {
        intention: "foo",
      },
    });
    await localStorage.set({
      uri: "/api/pomodoro-intention",
      data: {
        intention: "bar",
      },
    });
    await localStorage.set({
      uri: "/api/pomodoro",
      data: {
        pomodoros: [
          {
            year: 2024,
            date: 4,
            month: 7,
            hour: 12,
            label: "foo",
            seconds: 60,
            id: "0",
          },
          {
            year: 2024,
            date: 3,
            month: 6,
            hour: 12,
            label: "bar",
            seconds: 60,
            id: "20240603",
          },
          {
            year: 2025,
            date: 4,
            month: 7,
            hour: 11,
            label: "foo",
            seconds: 60,
            id: "20250704",
          },
        ],
      },
    });
    await localStorage.delete({
      uri: "/api/pomodoro/delete/intention",
      data: { intention: "foo" },
    });
    const pomodoros = await localStorage.get({ uri: "/api/pomodoro" });
    expect(pomodoros).toStrictEqual({
      2024: {
        6: { 3: { 12: [{ label: "bar", seconds: 60, id: "20240603" }] } },
      },
    });
  });
});
