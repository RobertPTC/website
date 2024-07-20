import { Box, Typography } from "@mui/material";

import { PlanetaryHour } from "./types";

export default function CurrentHour({ hours }: { hours: PlanetaryHour[] }) {
  const currentHour = hours.find((h) => h.isCurrent);
  if (!currentHour) return <></>;
  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h2">{currentHour.ruler}</Typography>
      <Typography variant="h2" sx={{ fontSize: "16px" }}>
        rules this planetary hour
      </Typography>
    </Box>
  );
}
