"use client";

import { Box, Typography } from "@mui/material";

import useMoments from "./use-moments";

export default function MomentsOnDay({
  year,
  month,
  date,
}: {
  year: string;
  month: string;
  date: string;
}) {
  const moments = useMoments({ year, month, date });
  const timeFormat = Intl.DateTimeFormat("en", { month: "long" });
  if (!moments) return <></>;
  return (
    <>
      <Typography variant="h2" sx={{ fontSize: "28px", mb: 1 }}>
        {timeFormat.format(new Date(Number(year), Number(month)))} {date},{" "}
        {year}
      </Typography>
      {moments[month].moments.all.map((m) => {
        return (
          <Box key={m.id} sx={{ maxWidth: ["100%", "100%", "80%"] }}>
            <Typography sx={{ whiteSpace: "pre-wrap" }}>{m.moment}</Typography>
          </Box>
        );
      })}
    </>
  );
}
