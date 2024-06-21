"use client";

import DownloadIcon from "@mui/icons-material/Download";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import { Box, Button } from "@mui/material";
import Link from "next/link";

export default function Actions() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
      <Button
        startIcon={<HistoryEduIcon />}
        LinkComponent={Link}
        href="/moments-of-being/create-moment"
      >
        Create Moment
      </Button>
      <Button
        startIcon={<DownloadIcon />}
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
    </Box>
  );
}
