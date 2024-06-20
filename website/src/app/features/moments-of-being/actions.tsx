"use client";

import DownloadIcon from "@mui/icons-material/Download";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";

export default function Actions() {
  return (
    <>
      <Link href="/moments-of-being/create-moment">
        <Box display="flex" p={1} alignItems="center">
          <Box mr={1} ml="-4px">
            <HistoryEduIcon fontSize="small" />
          </Box>
          <Typography>Create Moment</Typography>
        </Box>
      </Link>

      <Button
        startIcon={<DownloadIcon />}
        sx={{ textTransform: "none", fontSize: "1rem" }}
        onClick={async () => {
          const res = await fetch("/api/moments-of-being/download-moments", {
            method: "POST",
            body: JSON.stringify({}),
          });
          const json = await res.json();
          const a = document.createElement("a");
          a.href = json.pdfDataURI;
          a.download = "moments";
          a.click();
        }}
      >
        Download Moments
      </Button>
    </>
  );
}
