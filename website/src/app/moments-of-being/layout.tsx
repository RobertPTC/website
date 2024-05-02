import { ReactNode } from "react";

import { Box, Grid } from "@mui/material";

import NavDrawer from "app/features/moments-of-being/nav-drawer";
import NavLinks from "app/features/moments-of-being/nav-links";

export default function MOBLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Box mb={2}>
        <NavLinks />
      </Box>
      <Grid container columnSpacing={1}>
        <Grid item xs={3} display={["none", "block"]}>
          <NavDrawer />
        </Grid>
        <Grid item xs={12} sm={9}>
          {children}
        </Grid>
      </Grid>
    </>
  );
}
