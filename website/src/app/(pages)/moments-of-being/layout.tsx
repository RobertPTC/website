import { ReactNode } from "react";

import { Box, Grid, Typography } from "@mui/material";

import MainLayoutWithPadding from "@app/components/main-layout-with-padding";

import ActionsDrawer from "./actions-drawer";
import ActionsMenu from "./actions-menu";

export default function MOBLayout({ children }: { children: ReactNode }) {
  return (
    <MainLayoutWithPadding>
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
    </MainLayoutWithPadding>
  );
}
