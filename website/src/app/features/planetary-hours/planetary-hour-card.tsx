import { Box, Card, CardContent, Typography } from "@mui/material";

import { hourFormat } from "./constants";
import { PlanetaryHour } from "./types";

export default function PlanetaryHourCard({ h }: { h: PlanetaryHour }) {
  const isSaturn = h.ruler === "Saturn";
  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: h.color,
        color: isSaturn ? "white" : "black",
        height: "100%",
      }}
    >
      <CardContent
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ mb: 1 }}>{h.Icon()}</Box>
        <Box>
          <Typography fontSize="1.2rem">{h.ruler}</Typography>
        </Box>
        <Box mb={1}>
          <Typography>
            {h.hourStart.format(hourFormat)} – {h.hourEnd.format(hourFormat)}
          </Typography>
        </Box>
        <Box>
          <Typography>{h.action}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
