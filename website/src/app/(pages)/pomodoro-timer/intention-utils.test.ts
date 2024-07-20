import dayjs from "dayjs";

import {
  secondsToTimerArray,
  renderActiveTimer,
  determinePomodoroTimeSegments,
} from "./intention-utils";

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
        ({ label, seconds }) => ({ label, seconds })
      )
    ).toStrictEqual([
      {
        label: "foo",
        seconds: 15 * 60,
      },
    ]);
    const start2 = dayjs(new Date(2024, 6, 20, 14, 33, 30));
    expect(
      determinePomodoroTimeSegments(140 * 60, start2, "foo").map(
        ({ label, seconds }) => ({ label, seconds })
      )
    ).toStrictEqual([
      { label: "foo", seconds: 27 * 60 - 30 },
      { label: "foo", seconds: 60 * 60 },
      { label: "foo", seconds: 53 * 60 + 30 },
    ]);
  });
});
