// src/components/admin/AdminLayout.tsx
import React from "react";
import { Box, Toolbar, CssBaseline } from "@mui/material";
import AdminSideNav from "./SideNav";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../theme";

/**
 * AdminLayout provides a premium dark‑theme layout with a glass‑morphism drawer.
 * It wraps the admin workspace pages and renders the navigation sidebar.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "background.default" }}>
        <AdminSideNav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {/* Place a toolbar to push content below the fixed AppBar inside SideNav */}
          <Toolbar />
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
