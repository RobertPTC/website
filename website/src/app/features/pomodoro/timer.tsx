import { Box } from "@mui/material";

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return `M${start.x},${start.y} A${radius},${radius} 0 ${largeArcFlag},0 ${end.x},${end.y}`;
}
export default function Timer({
  timeRemainingDeg,
}: {
  timeRemainingDeg: number;
}) {
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
          <Box
            component="path"
            d={describeArc(0, 0, 49, 0, timeRemainingDeg)}
            stroke="#880808"
            strokeWidth="3"
          />
        </Box>
      </Box>
    </Box>
  );
}
