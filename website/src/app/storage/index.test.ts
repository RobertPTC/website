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
  it("accesses data in local storage", async () => {
    const localStorage = Storage["localStorage"](mockLocalStorage);
    localStorage.set("pomodoros", {
      "2024": { "6": { "3": [{ label: "hi" }] } },
    });
    const data = await localStorage.get<Pomodoro[]>("pomodoros", "2024/6/3");
    expect(data).toStrictEqual([{ label: "hi" }]);
  });
});
