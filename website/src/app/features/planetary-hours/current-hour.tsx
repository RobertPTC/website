import { Box, Typography } from "@mui/material";

import { PlanetaryHour } from "./types";

export default function CurrentHour({ hours }: { hours?: PlanetaryHour[] }) {
  if (!hours) return <></>;
  const currentHour = hours.find((h) => h.isCurrent);
  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h2">{currentHour?.ruler}</Typography>
      <Typography variant="h2" sx={{ fontSize: "16px" }}>
        is the ruler of this planetary hour
      </Typography>
    </Box>
  );
}
