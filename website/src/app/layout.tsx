import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Box, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";

import "./globals.css";
import { Nav } from "./components/nav";
import theme from "./theme";

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
            <Box component="body">
              <Box
                sx={{
                  position: "sticky",
                  top: 0,
                  background: "rgb(var(--background-start-rgb))",
                  p: 2,
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
