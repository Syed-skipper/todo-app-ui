"use client";

import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { notificationsApi } from "../lib/api";

const pages = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Expenses", path: "/expenses" },
  { label: "Cards", path: "/cards" },
  { label: "Budgets", path: "/budgets" },
  { label: "Insights", path: "/insights" },
];

export default function AppLayout({ children, title }) {
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState("");
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    setMounted(true);
    setUserName(localStorage.getItem("user_name") || "");
    notificationsApi
      .list({ unreadOnly: "true", limit: 1 })
      .then((r) => setUnread(r.data?.data?.unreadCount || 0))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const navigate = (path) => {
    setAnchorEl(null);
    router.push(path);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fb" }}>
      <AppBar position="static" sx={{ bgcolor: "#0f172a" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, flexGrow: { xs: 1, md: 0 } }}>
              Family Expense Tracker
            </Typography>
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, flexGrow: 1 }}>
              {pages.map((p) => (
                <Button
                  key={p.path}
                  onClick={() => navigate(p.path)}
                  sx={{
                    color: pathname === p.path ? "#38bdf8" : "white",
                    fontWeight: pathname === p.path ? 700 : 400,
                  }}
                >
                  {p.label}
                </Button>
              ))}
            </Box>
            <IconButton color="inherit" sx={{ display: { md: "none" } }} onClick={(e) => setAnchorEl(e.currentTarget)}>
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              {pages.map((p) => (
                <MenuItem key={p.path} onClick={() => navigate(p.path)}>
                  {p.label}
                </MenuItem>
              ))}
            </Menu>
            {mounted && unread > 0 ? (
              <Badge badgeContent={unread} color="error">
                <NotificationsIcon sx={{ color: "white", mr: 1 }} />
              </Badge>
            ) : (
              <NotificationsIcon sx={{ color: "white", mr: 1 }} />
            )}
            {mounted && (
              <Typography variant="body2" sx={{ color: "#94a3b8", display: { xs: "none", sm: "block" } }}>
                {userName}
              </Typography>
            )}
            <Button variant="outlined" size="small" onClick={handleLogout} sx={{ color: "white", borderColor: "#475569" }}>
              Logout
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {title && (
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: "#0f172a" }}>
            {title}
          </Typography>
        )}
        {children}
      </Container>
    </Box>
  );
}
