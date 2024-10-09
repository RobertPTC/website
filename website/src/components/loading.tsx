import { Box, CircularProgress, Typography } from "@mui/material";

export function Loading({ loadingText }: { loadingText: string }) {
  return (
    <Box>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography
          sx={{ fontSize: "18px", textAlign: "center", mb: 1 }}
          variant="h1"
        >
          {loadingText}
        </Typography>
        <CircularProgress
          size={40}
          sx={{ ".MuiCircularProgress-circle": { stroke: "var(--accent)" } }}
        />
      </Box>
    </Box>
  );
}
