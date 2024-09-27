import { Box, Card, CardContent, Typography } from "@mui/material";

import { hourFormat } from "./constants";
import { PlanetaryHour } from "./types";

export default function PlanetaryHourCard({ h }: { h: PlanetaryHour }) {
  const useWhite = h.ruler === "Saturn" || h.ruler === "Mars";
  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: h.color,
        color: useWhite ? "white" : "black",
        height: "100%",
      }}
      component="article"
    >
      <CardContent
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box mb={1} display="flex" alignItems="center">
          <Typography
            fontSize="1.2rem"
            color={useWhite ? "white" : "inherit"}
            variant="h3"
            sx={{ mr: 1 }}
          >
            {h.ruler}
          </Typography>
          <Box sx={{ height: "24px", width: "24px" }}>{h.Icon()}</Box>
        </Box>
        <Box mb={1}>
          <Typography color={useWhite ? "white" : "inherit"}>
            {h.hourStart.format(hourFormat)} – {h.hourEnd.format(hourFormat)}
          </Typography>
        </Box>
        <Box>
          <Typography color={useWhite ? "white" : "inherit"}>
            {h.action}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
