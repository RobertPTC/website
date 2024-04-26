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
            <Box sx={{ pt: 2, px: 2 }} component="body">
              <Box mb={2}>
                <Nav />
              </Box>
              {children}
            </Box>
          </UserProvider>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </html>
  );
}
