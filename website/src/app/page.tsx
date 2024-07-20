import { Box, Typography } from "@mui/material";
import { Metadata } from "next";

import { GhostWriter } from "./components/ghost-writer";

export const metadata: Metadata = {
  title: "Robert P Cunningham",
  description:
    "Robert P Cunningham is an author and programmer, professionally.",
};

export default function Home() {
  return (
    <Box component="main">
      <Box
        id="backgroundImage"
        sx={{
          backgroundImage: "url(https://i.ibb.co/X5jSz0K/ocean.gif)",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          height: "calc(100vh - 70px)",
        }}
      >
        <Typography
          variant="h1"
          sx={{ color: "white", fontSize: "2.5rem", p: 3 }}
        >
          Robert P Cunningham
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "white", fontSize: "2.5rem", px: 3 }}
        >
          is
        </Typography>
        <GhostWriter />
        <Typography>
          <Box
            component="a"
            href="rptc3000@gmail.com"
            sx={{ px: 3, color: "white" }}
          >
            rptc3000@gmail.com
          </Box>
        </Typography>
        <Typography
          variant="h2"
          sx={{ color: "white", fontSize: "1.5rem", p: 3, mt: 1 }}
        >
          Publications
        </Typography>
        <Typography sx={{ mb: 0.5 }}>
          <Box
            component="a"
            href="https://www.subnivean.org/post/robert-cunningham"
            sx={{ color: "white", px: 3 }}
          >
            Subnivean - Poetry
          </Box>
        </Typography>
      </Box>
    </Box>
  );
}
