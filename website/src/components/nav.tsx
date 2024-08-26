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
    <Box>
      <Box
        sx={{
          display: ["block", "block", "none", "none"],
        }}
      >
        <Accordion sx={{ background: "rgb(var(--background-start-rgb))" }}>
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
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Home
                </Typography>
              </Link>
              <Link href="/planetary-hours-calculator">
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Planetary Hours Calculator
                </Typography>
              </Link>
              <Link href="/pomodoro-timer">
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Pomodoro Timer
                </Typography>
              </Link>
              <Link href="/blog/building-the-google-timer">
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Blog
                </Typography>
              </Link>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <Box display="flex" alignItems="center" mb={1}>
              <Box
                component="a"
                href="https://www.linkedin.com/in/robertpcunningham/"
                aria-label="LinkedIn"
                target="_blank"
                sx={{ display: "flex", mr: 2 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  data-supported-dps="24x24"
                  fill="rgb(10, 102, 194)"
                  width="24"
                  height="24"
                  focusable="false"
                >
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                </svg>
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
          <Grid item xs={7} display="flex" alignItems="center">
            <Link href="/" style={{ marginRight: "16px" }}>
              <Typography variant="body1" sx={linkStyles}>
                Robert P Cunningham
              </Typography>
            </Link>
            <Box
              component="a"
              href="https://www.linkedin.com/in/robertpcunningham/"
              aria-label="LinkedIn"
              target="_blank"
              sx={{ display: "flex", mr: 2 }}
            >
              <Box
                component="svg"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="rgb(10, 102, 194)"
                width="24px"
                height="24"
              >
                <Box
                  component="path"
                  d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"
                />
              </Box>
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
          <Grid
            item
            container
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
            xs={5}
          >
            <Box sx={{ mr: 2 }}>
              <Link href="/planetary-hours-calculator">
                <Typography variant="body1">
                  Planetary Hours Calculator
                </Typography>
              </Link>
            </Box>
            <Box sx={{ mr: 2 }}>
              <Link href="/pomodoro-timer">
                <Typography variant="body1">Pomodoro Timer</Typography>
              </Link>
            </Box>
            <Box>
              <Link href="/blog/building-the-google-timer">
                <Typography variant="body1">Blog</Typography>
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
