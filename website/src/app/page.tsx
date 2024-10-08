import { Box, Typography } from "@mui/material";
import { Metadata } from "next";

import { GhostWriter } from "../components/ghost-writer";

export const metadata: Metadata = {
  title: "Robert P Cunningham",
  description:
    "Robert P Cunningham is a professional author and software engineer.",
};

export default function Home() {
  return (
    <Box component="main">
      <Box
        component="video"
        autoPlay
        playsInline
        loop
        src="/ocean.mp4"
        muted
        sx={{
          position: "fixed",
          minWidth: "100%",
          minHeight: "100%",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
      <Box sx={{ position: "relative", zIndex: 100 }}>
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h1"
            sx={{ color: "white", fontSize: "2.5rem", mb: 2 }}
          >
            Robert P Cunningham
          </Typography>
          <Typography sx={{ color: "white", fontSize: "2.5rem", mb: 1 }}>
            is
          </Typography>
          <Box sx={{ mb: 2 }}>
            <GhostWriter />
          </Box>
          <Box>
            <Typography sx={{ fontStyle: "italic", color: "white" }}>
              Ad maiorem Dei gloriam
            </Typography>
          </Box>
        </Box>
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
