import { ReactNode } from "react";

import { Box } from "@mui/material";

export default function MainLayoutWithPadding({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Box component="main" sx={{ p: 2, maxWidth: "1440px", margin: "auto" }}>
      {children}
    </Box>
  );
}
