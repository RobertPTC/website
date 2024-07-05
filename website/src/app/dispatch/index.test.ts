import { pomodoroDispatch } from ".";

describe("dispatch", () => {
  it("subscribes and publishes", () => {
    const subscriber1 = jest.fn();
    const subscriber2 = jest.fn();
    const subscriber3 = jest.fn();
    pomodoroDispatch.subscribe("setPomodoroIntentions", subscriber1);
    pomodoroDispatch.subscribe("setPomodoroIntentions", subscriber2);
    pomodoroDispatch.subscribe("pomodoroCountdownEnd", subscriber3);
    pomodoroDispatch.publish("setPomodoroIntentions");
    expect(subscriber1).toHaveBeenCalledTimes(1);
    expect(subscriber2).toHaveBeenCalledTimes(1);
    expect(subscriber3).not.toHaveBeenCalled();
  });
  it("throws an error if event with no subscribers", () => {
    const subscriber1 = jest.fn();
    pomodoroDispatch.subscribe("setPomodoroIntentions", subscriber1);
    pomodoroDispatch.publish("pomodoroCountdownEnd");
    expect(pomodoroDispatch.publish).toThrow();
  });
});
