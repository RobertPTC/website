import { useEffect, useState } from "react";

import { Moments } from "app/api/types";

export default function useMoments({ year }: { year: string }) {
  const [moments, setMoments] = useState<Moments | undefined>();
  useEffect(() => {
    fetch(`/api/moments-of-being-moments?year=${year}`).then(async (res) => {
      const json = await res.json();
      setMoments(json);
      return;
    });
  }, [year]);
  return moments;
}
