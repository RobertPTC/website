import { useEffect, useState } from "react";

export default function useNav() {
  const [nav, setNav] = useState();
  useEffect(() => {
    fetch("/api/moments-of-being-nav")
      .then(async (res) => {
        const json = await res.json();
        console.log("json ", json);
        return json;
      })
      .catch((e) => {});
  }, []);
  return;
}
