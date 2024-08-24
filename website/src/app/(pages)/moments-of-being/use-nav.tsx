import { useEffect, useState } from "react";

import { MomentNav } from "app/api/types";
import Requests, { MomentsNavRequest } from "requests";

const storage = Requests["api"](fetch);

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
