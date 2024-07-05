type EventNames = {
  pomodoro: "setPomodoroIntentions" | "pomodoroCountdownEnd";
};

type Namespaces = keyof EventNames;

interface Dispatch<T extends Namespaces> {
  subscribe(eventName: EventNames[T], cb: () => void): void;
  publish(eventName: EventNames[T]): void;
}

const dispatchNamespaces: {
  [key in Namespaces]: { [key: string]: (() => void)[] };
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
