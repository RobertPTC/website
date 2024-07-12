type EventNames = {
  pomodoro: "setPomodoroIntentions" | "pomodoroCountdownEnd" | "setPomodoro";
};

type Namespaces = keyof EventNames;

interface Dispatch<T extends Namespaces> {
  subscribe(eventName: EventNames[T], cb: Function): void;
  publish(eventName: EventNames[T]): void;
  unsubscribe(eventName: EventNames[T], cb: Function): void;
}

const dispatchNamespaces: {
  [key in Namespaces]: { [key: string]: Function[] };
} = {
  pomodoro: {},
} as const;

function dispatchFactory<T extends Namespaces>(
  namespace: Namespaces
): () => Dispatch<T> {
  const ns = dispatchNamespaces[namespace];
  return () => ({
    subscribe(eventName, cb) {
      const callbacks = ns[eventName] || [];
      ns[eventName] = [...callbacks, cb];
    },
    unsubscribe(eventName, cb) {
      const callbacks = ns[eventName] || [];
      console.log("callbacks ", callbacks.length);
      ns[eventName] = callbacks.filter((callback) => {
        return callback !== cb;
      });
    },
    publish(eventName) {
      const callbacks = ns[eventName];
      if (!callbacks) {
        throw new Error(
          `publish called for ${eventName} without any callbacks subscribed to it`
        );
      }
      callbacks.forEach((cb) => {
        cb();
      });
    },
  });
}

export const pomodoroDispatch = dispatchFactory("pomodoro")();
