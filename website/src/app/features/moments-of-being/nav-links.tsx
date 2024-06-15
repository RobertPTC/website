"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import Link from "next/link";

import useNav from "./use-nav";

export default function NavLinks() {
  const nav = useNav();
  if (!nav)
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography sx={{ fontSize: "18px" }}>Loading nav links</Typography>
          <CircularProgress
            size={40}
            sx={{ ".MuiCircularProgress-circle": { stroke: "var(--accent)" } }}
          />
        </Box>
      </Box>
    );

  return (
    <>
      {nav.map((year) => {
        return (
          <Link href={`/moments-of-being/moments/${year}`} key={year}>
            <Typography>{year}</Typography>
          </Link>
        );
      })}
    </>
  );
}
