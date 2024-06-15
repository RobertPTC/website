import { ReactNode } from "react";

import { Box, Grid, Typography } from "@mui/material";

import ActionsDrawer from "app/features/moments-of-being/actions-drawer";
import ActionsMenu from "app/features/moments-of-being/actions-menu";

export default function MOBLayout({ children }: { children: ReactNode }) {
  return (
    <Box component="main" sx={{ p: 2 }}>
      <Box display="flex" mb={1}>
        <Box sx={{ display: ["block", "none"] }}>
          <ActionsDrawer />
        </Box>
        <Typography sx={{ fontSize: "18px", lineHeight: "40px" }}>
          Moments of Being
        </Typography>
      </Box>
      <Grid container columnSpacing={3}>
        <Grid item xs={3} display={["none", "block"]}>
          <ActionsMenu />
        </Grid>
        <Grid item xs={12} sm={9}>
          {children}
        </Grid>
      </Grid>
    </Box>
  );
}
