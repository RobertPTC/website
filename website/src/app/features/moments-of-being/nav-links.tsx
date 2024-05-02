"use client";

import { Typography } from "@mui/material";
import Link from "next/link";

import useNav from "./use-nav";

export default function NavLinks() {
  const nav = useNav();
  if (!nav) return <></>;

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
