import { Pomodoro } from "app/features/pomodoro/types";

import Storage from ".";

let storage: { [key: string]: any } = {};

const mockLocalStorage: Storage = {
  getItem(key) {
    return storage[key];
  },
  length: 0,
  clear: function (): void {
    throw new Error("Function not implemented.");
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
  it("accesses data in local storage from initially empty data storage", async () => {
    const localStorage = Storage["localStorage"](mockLocalStorage);
    await localStorage.set({
      uri: "/api/pomodoro",
      data: {
        year: "2024",
        date: "3",
        month: "6",
        pomodoro: { label: "hi", seconds: 60, id: "0" },
      },
    });
    const data = await localStorage.get<Pomodoro[]>({
      uri: "/api/pomodoro?year=2024&month=6&date=3",
    });
    expect(data).toStrictEqual([{ label: "hi", seconds: 60, id: "0" }]);
  });
  it("accesses data in local storage when date is initially empty", async () => {
    const localStorage = Storage["localStorage"](mockLocalStorage);
    await localStorage.set({
      uri: "/api/pomodoro",
      data: {
        year: "2024",
        date: "3",
        month: "6",
        pomodoro: { label: "hi", seconds: 60, id: "0" },
      },
    });
    await localStorage.set({
      uri: "/api/pomodoro",
      data: {
        year: "2024",
        date: "4",
        month: "6",
        pomodoro: { label: "hi", seconds: 60, id: "20240604" },
      },
    });
    const data = await localStorage.get<Pomodoro[]>({
      uri: "/api/pomodoro?year=2024&month=6&date=4",
    });
    expect(data).toStrictEqual([{ label: "hi", seconds: 60, id: "20240604" }]);
  });
  it("accesses data in local storage when month is initially empty", async () => {
    const localStorage = Storage["localStorage"](mockLocalStorage);
    await localStorage.set({
      uri: "/api/pomodoro",
      data: {
        year: "2024",
        date: "3",
        month: "6",
        pomodoro: { label: "hi", seconds: 60, id: "0" },
      },
    });
    await localStorage.set({
      uri: "/api/pomodoro",
      data: {
        year: "2024",
        date: "4",
        month: "7",
        pomodoro: { label: "hi", seconds: 60, id: "20240704" },
      },
    });
    const data = await localStorage.get<Pomodoro[]>({
      uri: "/api/pomodoro?year=2024&month=7&date=4",
    });
    expect(data).toStrictEqual([{ label: "hi", seconds: 60, id: "20240704" }]);
  });
  it("accesses data in local storage when year is initially empty", async () => {
    const localStorage = Storage["localStorage"](mockLocalStorage);
    await localStorage.set({
      uri: "/api/pomodoro",
      data: {
        year: "2024",
        date: "3",
        month: "6",
        pomodoro: { label: "hi", seconds: 60, id: "0" },
      },
    });
    await localStorage.set({
      uri: "/api/pomodoro",
      data: {
        year: "2025",
        date: "4",
        month: "7",
        pomodoro: { label: "hi", seconds: 60, id: "20250704" },
      },
    });
    const data = await localStorage.get<Pomodoro[]>({
      uri: "/api/pomodoro?year=2025&month=7&date=4",
    });
    expect(data).toStrictEqual([{ label: "hi", seconds: 60, id: "20250704" }]);
  });
});
