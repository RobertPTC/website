import { Box } from "@mui/material";

import NavLinks from "./nav-links";

export default function ActionsMenu() {
  return (
    <Box
      sx={{ height: "calc(100vh - 70px)", background: "red", width: "100%" }}
    >
      <NavLinks />
    </Box>
  );
}
