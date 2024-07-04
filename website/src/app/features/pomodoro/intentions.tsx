"use client";
import { useEffect, useState } from "react";

import Storage, { PomodoroIntentionRequest } from "app/storage";

export default function Intentions() {
  const [intentions, setIntentions] = useState<string[]>([]);
  useEffect(() => {
    if (!window) return;
    const storage = Storage["localStorage"](localStorage);
    storage
      .get<PomodoroIntentionRequest>({ uri: "/api/pomodoro-intention" })
      .then((res) => {
        setIntentions(res);
      });
    console.log("window");
  }, []);
  console.log("intentions");
  return <></>;
}
