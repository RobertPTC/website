"use client";

import DownloadIcon from "@mui/icons-material/Download";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";

export default function Actions() {
  return (
    <>
      <Link href="/moments-of-being/create-moment">
        <Box display="flex">
          <Box mr={1} mb={1}>
            <HistoryEduIcon />
          </Box>
          <Typography>Create Moment</Typography>
        </Box>
      </Link>

      <Box display="flex">
        <Box mr={1}>
          <DownloadIcon />
        </Box>
        <Button
          onClick={async () => {
            const res = await fetch("/api/moments-of-being/download-moments", {
              method: "POST",
              body: JSON.stringify({ ok: "hi" }),
            });
            const json = await res.json();
            const a = document.createElement("a");
            a.href = json.pdfDataURI;
            a.download = "moments";
            a.click();
          }}
        >
          Download Button
        </Button>
      </Box>
    </>
  );
}
