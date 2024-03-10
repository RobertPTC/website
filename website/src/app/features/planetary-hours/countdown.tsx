import { Box } from "@mui/material";

export default function Countdown() {
  return (
    <Box>
      <Box component="svg" sx={{ height: "100px", width: "100px" }}>
        <Box component="g" sx={{ fill: "none", stroke: "none" }}>
          <Box
            component="circle"
            cx="50"
            cy="50"
            r="45"
            sx={{ stroke: "rgb(var(--elapsed-time-rgb))", strokeWidth: "7px" }}
          />
        </Box>
      </Box>
    </Box>
  );
}
