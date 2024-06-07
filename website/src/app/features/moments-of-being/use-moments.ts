import { useEffect, useState } from "react";

import { Moments } from "app/api/types";
import ferry from "app/ferry";

export default function useMoments({ year }: { year: string }) {
  const [moments, setMoments] = useState<Moments | undefined>();
  useEffect(() => {
    ferry<Moments>(`/api/moments-of-being/moments?year=${year}`).then((res) => {
      console.log("res ", res);
      setMoments(res);
      return;
    });
  }, [year]);
  return moments;
}
