import { useEffect, useState } from "react";

import { MomentNav } from "app/api/types";

export default function useNav() {
  const [nav, setNav] = useState<MomentNav | undefined>();
  useEffect(() => {
    fetch("/api/moments-of-being-nav")
      .then(async (res) => {
        const json = await res.json();
        setNav(json);
      })
      .catch((e) => {});
  }, []);
  return nav;
}
