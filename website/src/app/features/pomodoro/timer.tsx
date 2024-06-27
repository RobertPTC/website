import { Box } from "@mui/material";

const minutes = new Array(60).fill(0);
export default function Timer() {
  return (
    <Box component="svg" sx={{ height: "102px", width: "102px" }}>
      <Box component="g" sx={{ fill: "none", stroke: "none" }}>
        <Box
          component="circle"
          cx="51"
          cy="51"
          r="50"
          sx={{
            stroke: "var(--accent)",
            strokeWidth: "1px",
          }}
        />
        <Box component="g" sx={{ transform: "translate(51px, 51px)" }}>
          {minutes.map((_, i) => (
            <Box
              key={i}
              component="line"
              x1="50"
              x2="45"
              y1="0"
              y2="0"
              strokeWidth="1px"
              stroke="var(--accent)"
              sx={{
                transform: `rotate(calc(${i * 6}deg))`,
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
