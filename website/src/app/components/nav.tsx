import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
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
      <Box sx={{ display: ["block", "block", "none", "none"] }}>
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
            <Box component="nav">
              <Link href="/">
                <Typography variant="body1">Home</Typography>
              </Link>
              <Link href="/planetary-hours-calculator">
                <Typography variant="body1">
                  Planetary Hours Calculator
                </Typography>
              </Link>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
      <Box component="nav" sx={{ display: ["none", "none", "block", "block"] }}>
        <Link href="/">
          <Typography variant="body1" sx={linkStyles}>
            Robert P Cunningham
          </Typography>
        </Link>
        <Link href="/planetary-hours-calculator">
          <Typography variant="body1">Planetary Hours Calculator</Typography>
        </Link>
      </Box>
    </>
  );
}
