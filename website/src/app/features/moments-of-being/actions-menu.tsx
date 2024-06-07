import { Box } from "@mui/material";

import Actions from "./actions";
import NavLinks from "./nav-links";

export default function ActionsMenu() {
  return (
    <Box sx={{ height: "calc(100vh - 70px)", width: "100%" }}>
      <Box
        p={1}
        sx={{
          borderBottom: "1px solid",
          borderColor: "var(--moments-accent-hex)",
        }}
      >
        <NavLinks />
      </Box>
      <Box p={1}>
        <Actions />
      </Box>
    </Box>
  );
}
