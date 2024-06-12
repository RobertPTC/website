import { useEffect, useState } from "react";

import { Moments } from "app/api/types";
import ferry from "app/ferry";

export default function useMoments({
  year,
  month,
  date,
}: {
  year: string;
  month: string | undefined;
  date: string | undefined;
}) {
  const [moments, setMoments] = useState<Moments | undefined>();
  useEffect(() => {
    ferry<Moments>(
      `/api/moments-of-being/moments?year=${year}${
        month ? `&month=${month}` : ""
      }${date ? `&date=${date}` : ""}`
    ).then((res) => {
      setMoments(res);
      return;
    });
  }, [year]);
  return moments;
}
