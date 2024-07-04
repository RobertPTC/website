import { useEffect, useState } from "react";

import { MomentNav } from "app/api/types";
import Storage from "app/storage";

export default function useNav() {
  const [nav, setNav] = useState<MomentNav | undefined>();
  useEffect(() => {
    Storage["api"]
      .get<MomentNav>("/api/moments-of-being/nav")
      .then((res) => {
        setNav(res);
      })
      .catch((e) => {});
  }, []);
  return nav;
}
