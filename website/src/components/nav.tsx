"use client";
import { useState } from "react";

import { Close, Menu } from "@mui/icons-material";
import { Box, Drawer, IconButton, SxProps, Typography } from "@mui/material";
import Link from "next/link";

const linkStyles: SxProps = {
  fontSize: "1.5rem",
};

function NavLinks() {
  return (
    <>
      <Box className="first_column">
        <Link href="/">
          <Typography variant="body1" sx={linkStyles}>
            Robert P Cunningham
          </Typography>
        </Link>
      </Box>
      <Box className="second_column">
        <Link href="/planetary-hours-calculator">
          <Typography variant="body1">Planetary Hours Calculator</Typography>
        </Link>
        <Link href="/pomodoro-timer">
          <Typography variant="body1">Pomodoro Timer</Typography>
        </Link>
        <Link href="/blog/building-the-google-timer">
          <Typography variant="body1">Blog</Typography>
        </Link>
      </Box>
    </>
  );
}

function MobileNav() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  function handleDrawerToggle() {
    setIsDrawerOpen(!isDrawerOpen);
  }
  return (
    <>
      <Drawer open={isDrawerOpen} onClose={handleDrawerToggle}>
        <Box
          display="grid"
          gridTemplateColumns="repeat(24, 1fr)"
          p={2}
          width="270px"
        >
          <IconButton onClick={handleDrawerToggle} sx={{ gridColumn: "24" }}>
            <Close />
          </IconButton>
          <Box gridColumn="span 24">
            <NavLinks />
          </Box>
        </Box>
      </Drawer>
      <Box display="grid" gridTemplateColumns="repeat(24, 1fr)">
        <IconButton sx={{ gridColumn: "24" }} onClick={handleDrawerToggle}>
          <Menu />
        </IconButton>
      </Box>
    </>
  );
}

export function Nav() {
  return (
    <Box
      component="nav"
      sx={{
        position: "sticky",
        top: 0,
        background: "rgb(var(--background-start-rgb))",
        p: 2,
        zIndex: 300,
      }}
    >
      <Box
        sx={{
          display: ["block", "block", "none", "none"],
        }}
      >
        <MobileNav />
      </Box>
      <Box
        gridTemplateColumns="repeat(24, 1fr)"
        sx={{
          display: ["none", "none", "grid", "grid"],
          ".first_column": {
            gridColumn: "span 12",
          },
          ".second_column": {
            gridColumn: "13 / span 12",
            display: "flex",
            justifyContent: "flex-end",
            a: {
              display: "inline-block",
              marginRight: 2,
              ":last-child": {
                marginRight: 0,
              },
            },
          },
        }}
      >
        <NavLinks />
      </Box>
    </Box>
  );
}
