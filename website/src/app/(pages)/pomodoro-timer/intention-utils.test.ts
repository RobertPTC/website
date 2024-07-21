import dayjs from "dayjs";

import {
  secondsToTimerArray,
  renderActiveTimer,
  determinePomodoroTimeSegments,
  createPomodoroRequest,
} from "./intention-utils";

import Storage from "../../storage";

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

describe("pomodoro functions", () => {
  it("computes array for 3600s", () => {
    const array = secondsToTimerArray(3600);
    expect(array).toStrictEqual([0, 1, 0, 0, 0, 0]);
  });
  it("computes array for 60s", () => {
    const array = secondsToTimerArray(60);
    expect(array).toStrictEqual([0, 0, 0, 1, 0, 0]);
  });
  it("computes array for 59s", () => {
    const array = secondsToTimerArray(59);
    expect(array).toStrictEqual([0, 0, 0, 0, 5, 9]);
  });
  it("computes array for 3599s", () => {
    const array = secondsToTimerArray(3599);
    expect(array).toStrictEqual([0, 0, 5, 9, 5, 9]);
  });
  it("computes array for 7201", () => {
    const array = secondsToTimerArray(7201);
    expect(array).toStrictEqual([0, 2, 0, 0, 0, 1]);
  });
  it("computes array for 36000s", () => {
    const array = secondsToTimerArray(36000);
    expect(array).toStrictEqual([1, 0, 0, 0, 0, 0]);
  });
  it("renders 5m00s when duration is 300", () => {
    expect(renderActiveTimer(300)).toEqual("5m00s");
  });
  it("renders 59m59s when duration is 3599", () => {
    expect(renderActiveTimer(3599)).toEqual("59m59s");
  });
  it("renders 59s when duration is 59", () => {
    expect(renderActiveTimer(59)).toEqual("59s");
  });
  it("renders 2h00m01s when duration is 7201", () => {
    expect(renderActiveTimer(7201)).toEqual("2h00m01s");
  });
  it("renders 10h00m00s when duration is 36000", () => {
    expect(renderActiveTimer(36000)).toEqual("10h00m00s");
  });
  it("determines pomodoro segments correctly", () => {
    const start = dayjs(new Date(2024, 6, 20, 14, 33, 30));
    expect(
      determinePomodoroTimeSegments(15 * 60, start, "foo").map(
        ({ label, seconds, month, year, date, hour }) => ({
          label,
          seconds,
          month,
          year,
          date,
          hour,
        })
      )
    ).toStrictEqual([
      {
        label: "foo",
        seconds: 15 * 60,
        hour: start.hour(),
        month: start.month(),
        year: start.year(),
        date: start.date(),
      },
    ]);
    const start1 = dayjs(new Date(2024, 6, 20, 14, 33, 25));
    const p = start1.add(27 * 60 - 25, "seconds");
    expect(
      determinePomodoroTimeSegments(27 * 60, start1, "foo").map(
        ({ label, seconds, month, year, date, hour }) => ({
          label,
          seconds,
          month,
          year,
          date,
          hour,
        })
      )
    ).toStrictEqual([
      {
        label: "foo",
        seconds: 27 * 60 - 25,
        hour: start.hour(),
        month: start.month(),
        year: start.year(),
        date: start.date(),
      },
      {
        label: "foo",
        seconds: 25,
        hour: p.hour(),
        month: p.month(),
        year: p.year(),
        date: p.date(),
      },
    ]);
    const start2 = dayjs(new Date(2024, 6, 20, 14, 33, 30));
    const p1 = start2.add(27 * 60 - 30, "seconds");
    const p2 = p1.add(60 * 60, "seconds");
    expect(
      determinePomodoroTimeSegments(140 * 60, start2, "foo").map(
        ({ label, seconds, month, year, date, hour }) => ({
          label,
          seconds,
          month,
          year,
          date,
          hour,
        })
      )
    ).toStrictEqual([
      {
        label: "foo",
        seconds: 27 * 60 - 30,
        hour: start.hour(),
        month: start.month(),
        year: start.year(),
        date: start.date(),
      },
      {
        label: "foo",
        seconds: 60 * 60,
        hour: p1.hour(),
        month: p1.month(),
        year: p1.year(),
        date: p1.date(),
      },
      {
        label: "foo",
        seconds: 53 * 60 + 30,
        hour: p2.hour(),
        month: p2.month(),
        year: p2.year(),
        date: p2.date(),
      },
    ]);
  });
  it("creates pomodoro request ", async () => {
    const duration = 60 * 30;
    const activeDuration = 0;
    const storage = Storage["localStorage"](mockLocalStorage);
    const startDate = dayjs(new Date(2024, 6, 21, 16, 50, 30));
    const pomodoroSpans = [5 * 60, 3 * 60];
    const label = "foo";
    const output = await createPomodoroRequest({
      label,
      activeDuration,
      duration,
      pomodoroSpans,
      storage,
      startDate,
    });
    expect(output.elapsedTime).toEqual(1320);
    expect(output.timeSegments[0].seconds).toEqual(570);
    expect(output.timeSegments[0].hour).toEqual(16);
    expect(output.timeSegments[1].seconds).toEqual(750);
    expect(output.timeSegments[1].hour).toEqual(17);
  });
});
