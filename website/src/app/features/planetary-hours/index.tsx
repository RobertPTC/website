"use client";

import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import useDate from "app/features/planetary-hours/use-date";
import usePosition from "app/features/planetary-hours/use-position";

import { hourFormat } from "./constants";
import CurrentHour from "./current-hour";
import LocationAutocomplete from "./location-autocomplete";
import useGetPlanetaryHours from "./use-get-planetary-hours";

export default function PlanetaryHours() {
  const [pos] = usePosition();
  const [dateInput, setDate] = useDate();
  const planetaryHours = useGetPlanetaryHours(pos, dateInput);

  return (
    <Box>
      <Box mb={2}>
        <Typography variant="h1" sx={{ fontSize: "36px", textAlign: "center" }}>
          Planetary Hours
        </Typography>
      </Box>
      <Box mb={2}>
        {dateInput.isCurrent && <CurrentHour hours={planetaryHours?.hours} />}
      </Box>
      <Grid container spacing={2} mb={5}>
        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date"
              value={dateInput.date}
              slotProps={{ textField: { fullWidth: true } }}
              onChange={(d) => {
                if (d) {
                  setDate({ date: d, isCurrent: false });
                }
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12}>
          {pos && <LocationAutocomplete pos={pos} />}
        </Grid>
      </Grid>
      {planetaryHours && (
        <Grid container spacing={2}>
          {planetaryHours.hours.map((h) => (
            <Grid key={h.hourStart.toISOString()} item xs={12}>
              <Card
                variant="outlined"
                sx={{
                  backgroundColor: h.color,
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
                    <Typography>
                      {h.hourStart.format(hourFormat)} –{" "}
                      {h.hourEnd.format(hourFormat)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
