import { Box, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { Roboto } from "next/font/google";

import "./globals.css";
import theme from "./theme";

import { Nav } from "../components/nav";

const roboto = Roboto({
  display: "swap",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--roboto-font",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <Box component="body" sx={{ ...roboto.style }}>
            <Nav />
            <Box>{children}</Box>
          </Box>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </html>
  );
}
