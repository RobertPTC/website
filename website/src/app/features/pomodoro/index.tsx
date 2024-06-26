import { Box } from "@mui/material";

export default function DayView() {
  const minutes = new Array(60).fill(0);
  return (
    <>
      <Box>
        <Box component="svg" sx={{ height: "502px", width: "502px" }}>
          <Box component="g" sx={{ fill: "none", stroke: "none" }}>
            <Box
              component="circle"
              cx="251"
              cy="251"
              r="250"
              sx={{
                stroke: "var(--accent)",
                strokeWidth: "1px",
              }}
            />
            <Box component="g" sx={{ transform: "translate(251px, 251px)" }}>
              {minutes.map((_, i) => (
                <Box
                  key={i}
                  component="line"
                  x1="250"
                  x2="245"
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
      </Box>
    </>
  );
}
