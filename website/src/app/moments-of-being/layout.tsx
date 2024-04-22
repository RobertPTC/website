import { ReactNode } from "react";

import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Box, Grid } from "@mui/material";

import NavAccordion from "app/features/moments-of-being/nav-accordion";
import { NavDrawer } from "app/features/moments-of-being/nav-drawer";

export default function MOBLayout({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <NavAccordion />
      <Box component="a" href="/api/auth/login">
        Login
      </Box>
      <Grid container columnSpacing={1}>
        <Grid item xs={3} display={["none", "block"]}>
          <NavDrawer />
        </Grid>
        <Grid item xs={12} sm={9}>
          {children}
        </Grid>
      </Grid>
    </UserProvider>
  );
}
