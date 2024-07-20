"use client";

import { useState } from "react";

import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { Box, Drawer, IconButton, Typography } from "@mui/material";

import Actions from "./actions";
import NavLinks from "./nav-links";

export default function ActionsDrawer() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  return (
    <>
      <IconButton
        aria-label={`${isDrawerOpen ? "close" : "open"} actions drawer`}
        color="primary"
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
      >
        <MenuOpenIcon />
      </IconButton>
      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sx={{
          width: 240,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            p: 2,
          },
        }}
      >
        <Box
          pb={2}
          mb={2}
          sx={{
            borderBottom: "1px solid",
            borderColor: "var(--accent)",
          }}
        >
          <Typography mb={1}>Years</Typography>
          <NavLinks />
        </Box>
        <Actions />
      </Drawer>
    </>
  );
}
