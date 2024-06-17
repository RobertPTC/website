import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Grid,
  SxProps,
  Typography,
} from "@mui/material";
import Link from "next/link";

const linkStyles: SxProps = {
  fontSize: "1.5rem",
};

export function Nav() {
  return (
    <>
      <Box
        sx={{
          display: ["block", "block", "none", "none"],
        }}
      >
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography
              variant="body1"
              sx={{ fontSize: "1.5rem", textAlign: "center", width: "100%" }}
            >
              Where shall you go?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box component="nav" mb={1}>
              <Link href="/">
                <Typography variant="body1">Home</Typography>
              </Link>
              <Link href="/planetary-hours-calculator">
                <Typography variant="body1">
                  Planetary Hours Calculator
                </Typography>
              </Link>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <Box display="flex" alignItems="center" mb={1}>
              <Box
                component="a"
                href="https://www.instagram.com/a_heavy_heaven/"
                aria-label="instagram"
                target="_blank"
                sx={{ display: "flex", mr: 2 }}
              >
                <Box
                  component="img"
                  src="https://i.ibb.co/g6McB2g/Instagram-icon.png"
                  width="24px"
                />
              </Box>
              <Box
                component="a"
                aria-label="substack"
                href="https://thecurioustimes.substack.com"
                sx={{ display: "flex" }}
                target="_blank"
              >
                <Box
                  component="img"
                  src="https://i.ibb.co/qYsTVW4/substack-wordmark.png"
                  width="100px"
                />
              </Box>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <Box display="flex">
              <Box component="a" href="/api/auth/login" sx={{ mr: 1 }}>
                <Typography>Login</Typography>
              </Box>
              <Box component="a" href="/api/auth/logout">
                <Typography>Logout</Typography>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
      <Box
        component="nav"
        sx={{
          display: ["none", "none", "block", "block"],
        }}
      >
        <Grid container>
          <Grid item xs={8} display="flex" alignItems="center">
            <Link href="/" style={{ marginRight: "16px" }}>
              <Typography variant="body1" sx={linkStyles}>
                Robert P Cunningham
              </Typography>
            </Link>
            <Box
              component="a"
              href="https://www.instagram.com/a_heavy_heaven/"
              aria-label="instagram"
              target="_blank"
              sx={{ display: "flex", mr: 2 }}
            >
              <Box
                component="img"
                src="https://i.ibb.co/g6McB2g/Instagram-icon.png"
                width="36px"
              />
            </Box>
            <Box
              component="a"
              href="https://thecurioustimes.substack.com"
              aria-label="substack"
              sx={{ display: "flex" }}
              target="_blank"
            >
              <Box
                component="img"
                src="https://i.ibb.co/qYsTVW4/substack-wordmark.png"
                width="100px"
              />
            </Box>
          </Grid>
          <Grid item display="flex" alignItems="center" xs={4}>
            <Link href="/planetary-hours-calculator">
              <Typography variant="body1">
                Planetary Hours Calculator
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
