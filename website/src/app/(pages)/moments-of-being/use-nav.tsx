import { useEffect, useState } from "react";

import { MomentNav } from "app/api/types";
import Storage, { MomentsNavRequest } from "app/storage";

const storage = Storage["api"](fetch);

export default function useNav() {
  const [nav, setNav] = useState<MomentNav | undefined>();
  useEffect(() => {
    storage
      .get<MomentsNavRequest>({ uri: "/api/moments-of-being/nav" })
      .then((res) => {
        if (res) {
          setNav(res);
        }
      })
      .catch((e) => {});
  }, []);
  return nav;
}