import { Box, Typography } from "@mui/material";

export default function Home() {
  return (
    <Box component="main">
      <Box
        id="backgroundImage"
        sx={{
          backgroundImage: "url(https://i.ibb.co/X5jSz0K/ocean.gif)",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          height: "calc(100vh - 90px)",
          left: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
          position: "relative",
          right: "50%",
          width: "100vw",
        }}
      >
        <Typography
          variant="h1"
          sx={{ color: "white", fontSize: "2.5rem", p: 3 }}
        >
          Robert P Cunningham
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "white", fontSize: "2.5rem", px: 3 }}
        >
          is
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "white", fontSize: "2.5rem", px: 3 }}
        >
          reading.
        </Typography>
      </Box>
    </Box>
  );
}
