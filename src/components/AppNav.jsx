"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Badge,
  Avatar,
  alpha,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { useEffect, useState } from "react";
import { notificationsApi } from "../lib/api";
import { appColors } from "../theme/theme";

const pages = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Expenses", path: "/expenses" },
  { label: "Cards", path: "/cards" },
  { label: "Budgets", path: "/budgets" },
  { label: "Insights", path: "/insights" },
];

const navLinkSx = (active) => ({
  px: 2,
  py: 1,
  borderRadius: 2,
  textDecoration: "none",
  display: "inline-block",
  fontSize: "0.875rem",
  fontFamily: "inherit",
  color: active ? appColors.sage : appColors.inkMuted,
  fontWeight: active ? 600 : 500,
  bgcolor: active ? appColors.mist : "transparent",
  transition: "background-color 0.15s ease, color 0.15s ease",
  "&:hover": {
    bgcolor: active ? appColors.mist : alpha(appColors.mist, 0.6),
  },
});

export default function AppNav() {
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
    window.location.href = "/login";
  };

  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1100,
        bgcolor: alpha(appColors.paper, 0.92),
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${appColors.border}`,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            py: 1.5,
            minHeight: 64,
          }}
        >
          <Link href="/dashboard" prefetch style={{ textDecoration: "none", color: "inherit" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexGrow: { xs: 1, md: 0 } }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: appColors.mist,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: appColors.sage,
                }}
              >
                <AccountBalanceWalletOutlinedIcon fontSize="small" />
              </Box>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2, color: appColors.ink }}>
                  Family Expense
                </Typography>
                <Typography variant="caption" sx={{ color: appColors.inkMuted }}>
                  Shared tracker
                </Typography>
              </Box>
            </Box>
          </Link>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5, flexGrow: 1, ml: 2 }}>
            {pages.map((p) => (
              <Box
                key={p.path}
                component={Link}
                href={p.path}
                prefetch
                sx={navLinkSx(pathname === p.path)}
              >
                {p.label}
              </Box>
            ))}
          </Box>

          <IconButton sx={{ display: { md: "none" } }} onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{ sx: { borderRadius: 2, mt: 1, minWidth: 180 } }}
          >
            {pages.map((p) => (
              <MenuItem
                key={p.path}
                component={Link}
                href={p.path}
                prefetch
                onClick={() => setAnchorEl(null)}
                selected={pathname === p.path}
                sx={{ borderRadius: 1, mx: 0.5 }}
              >
                {p.label}
              </MenuItem>
            ))}
          </Menu>

          {mounted && (
            <Badge
              badgeContent={unread}
              color="error"
              invisible={unread === 0}
              sx={{ "& .MuiBadge-badge": { fontSize: 10, minWidth: 16, height: 16 } }}
            >
              <IconButton size="small">
                <NotificationsNoneOutlinedIcon fontSize="small" />
              </IconButton>
            </Badge>
          )}

          {mounted && userName && (
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: appColors.sageLight,
                color: "#fff",
                fontSize: "0.85rem",
                fontWeight: 600,
                display: { xs: "none", sm: "flex" },
              }}
            >
              {initials}
            </Avatar>
          )}

          <Button variant="outlined" size="small" onClick={handleLogout} sx={{ ml: { xs: 0, sm: 0.5 } }}>
            Logout
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
