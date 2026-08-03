// src/components/admin/SideNav.tsx
import React from "react";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import PeopleIcon from "@mui/icons-material/People";
import BrushIcon from "@mui/icons-material/Brush";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { NavLink } from "react-router-dom";

/**
 * AdminSideNav renders the left navigation drawer used in the admin area.
 * It follows the dark‑theme with glass‑morphism defined in the theme file.
 */
const menuItems = [
  { label: "Dashboard", to: "/admin/overview", icon: <DashboardIcon /> },
  { label: "Subscriptions", to: "/admin/subscriptions", icon: <SubscriptionsIcon /> },
  { label: "Users", to: "/admin/users", icon: <PeopleIcon /> },
  { label: "Menu Management", to: "/admin/menu", icon: <MenuBookIcon /> },
  { label: "Branding", to: "/admin/branding", icon: <BrushIcon /> },
  { label: "Settings", to: "/admin/settings", icon: <SettingsIcon /> },
];

export default function AdminSideNav() {
  return (
    <Drawer
      variant="permanent"
      sx={{ width: 240, flexShrink: 0, "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" } }}
    >
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            component={NavLink}
            to={item.to}
            key={item.label}
            sx={{ "&.active": { backgroundColor: "primary.main", color: "primary.contrastText" } }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
