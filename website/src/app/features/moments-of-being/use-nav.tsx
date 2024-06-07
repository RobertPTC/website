import { useEffect, useState } from "react";

import { MomentNav } from "app/api/types";
import ferry from "app/ferry";

export default function useNav() {
  const [nav, setNav] = useState<MomentNav | undefined>();
  useEffect(() => {
    ferry<MomentNav>("/api/moments-of-being/nav")
      .then((res) => {
        setNav(res);
      })
      .catch((e) => {});
  }, []);
  return nav;
}
