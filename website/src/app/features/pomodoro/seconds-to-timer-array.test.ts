import secondsToTimerArray from "./seconds-to-timer-array";
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
});
