import { Grid } from "@mui/material";

import DayView from "app/features/pomodoro";

export default function Pomodoro() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <DayView />
      </Grid>
    </Grid>
  );
}
