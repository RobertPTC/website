"use client";

import { Box, Typography } from "@mui/material";
import Link from "next/link";

import { Loading } from "app/components/loading";

import useNav from "./use-nav";

export default function NavLinks() {
  const nav = useNav();
  if (!nav) return <Loading loadingText="Loading nav links" />;

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
