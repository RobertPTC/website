"use client";

import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import useDate from "app/features/planetary-hours/use-date";
import usePosition from "app/features/planetary-hours/use-position";

import { hourFormat } from "./constants";
import useGetPlanetaryHours from "./use-get-planetary-hours";

export default function PlanetaryHours() {
  const [pos] = usePosition();
  const [date] = useDate();
  const planetaryHours = useGetPlanetaryHours(pos, date);
  return (
    <Box>
      <Box>Planetary Hours</Box>
      <Box>Latitude: {pos?.latitude}</Box>
      <Box>Longitude: {pos?.longitude}</Box>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker label="Date" value={date} />
      </LocalizationProvider>
      {planetaryHours && (
        <Grid container spacing={2}>
          {planetaryHours.hours.map((h) => {
            return (
              <Grid key={h.hourStart.toISOString()} item xs={2}>
                <Card variant="outlined" sx={{ maxWidth: "250px" }}>
                  <CardContent
                    sx={{
                      alignItems: "center",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box sx={{ mb: 1 }}>{h.Icon()}</Box>
                    <Box>
                      <Typography>
                        {h.hourStart.format(hourFormat)} –{" "}
                        {h.hourEnd.format(hourFormat)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
