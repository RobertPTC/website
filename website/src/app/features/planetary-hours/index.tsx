"use client";

import { useEffect } from "react";

import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
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
  console.log("pos ", pos);
  const planetaryHours = useGetPlanetaryHours(pos, date);
  // useEffect(() => {
  //   fetch(
  //     "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?select=name&where=name%20like%20%22ruiz%22&limit=20&refine=cou_name_en%3A%22Argentina%22"
  //   ).then((res) => {
  //     res.json().then((j) => {
  //       console.log("j ", j);
  //     });
  //   });
  // }, []);
  return (
    <Box>
      <Box mb={2}>
        <Typography variant="h1" sx={{ fontSize: "36px", textAlign: "center" }}>
          Planetary Hours
        </Typography>
      </Box>
      <Grid container spacing={2} mb={5}>
        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date"
              value={date}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            options={[]}
            renderInput={(params) => (
              <TextField
                {...params}
                label="City"
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Grid>
      </Grid>
      {planetaryHours && (
        <Grid container spacing={2}>
          {planetaryHours.hours.map((h) => (
            <Grid key={h.hourStart.toISOString()} item xs={12}>
              <Card variant="outlined" sx={{ backgroundColor: h.color }}>
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
