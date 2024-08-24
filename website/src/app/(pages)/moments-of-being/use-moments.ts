import { useEffect, useState } from "react";

import { Moments } from "app/api/types";
import Requests, { MomentsRequest } from "requests";

const storage = Requests["api"](fetch);

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
    storage
      .get<MomentsRequest>({
        uri: `/api/moments-of-being/moments?year=${year}${
          month ? `&month=${month}` : ""
        }${date ? `&date=${date}` : ""}`,
      })
      .then((res) => {
        if (res) {
          setMoments(res);
        }
      });
  }, [year, month, date]);
  return moments;
}
