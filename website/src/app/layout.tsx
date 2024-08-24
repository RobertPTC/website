import { UserProvider } from "@auth0/nextjs-auth0/client";
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
          <UserProvider>
            <Box component="body" sx={{ ...roboto.style }}>
              <Box
                sx={{
                  position: "sticky",
                  top: 0,
                  background: "rgb(var(--background-start-rgb))",
                  p: 2,
                  zIndex: 300,
                }}
              >
                <Nav />
              </Box>
              <Box>{children}</Box>
            </Box>
          </UserProvider>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </html>
  );
}
