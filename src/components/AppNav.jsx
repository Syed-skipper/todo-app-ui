import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  IconButton,
  Text,
  Avatar,
  Menu,
  Portal,
  Badge,
} from "@chakra-ui/react";
import { HiBars3, HiBell, HiMoon, HiSun, HiOutlineWallet } from "react-icons/hi2";
import { useEffect, useState } from "react";
import { notificationsApi } from "../lib/api";
import { appColors } from "../theme/theme";
import { useThemeMode } from "../context/ThemeModeContext";

const pages = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Expenses", path: "/expenses" },
  { label: "Family", path: "/family-members" },
  { label: "Settlements", path: "/settlements" },
  { label: "Statements", path: "/statements" },
  { label: "Cards", path: "/cards" },
];

function NavLink({ to, active, children }) {
  return (
    <Box
      as={Link}
      to={to}
      px={4}
      py={2}
      borderRadius="8px"
      fontSize="sm"
      fontWeight={active ? 600 : 500}
      color={active ? appColors.sage : appColors.inkMuted}
      bg={active ? appColors.mist : "transparent"}
      textDecoration="none"
      transition="background 0.15s, color 0.15s"
      _hover={{ bg: appColors.mist }}
    >
      {children}
    </Box>
  );
}

export default function AppNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { mode, toggleMode } = useThemeMode();
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
    navigate("/login");
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
      as="header"
      position="sticky"
      top={0}
      zIndex={1100}
      bg="color-mix(in srgb, var(--paper) 92%, transparent)"
      backdropFilter="blur(12px)"
      borderBottom="1px solid"
      borderColor={appColors.border}
    >
      <Container maxW="container.lg" px={4}>
        <Box display="flex" alignItems="center" gap={4} py={3} minH="64px">
          <Link to="/dashboard" style={{ textDecoration: "none", color: "inherit", flexGrow: 1 }}>
            <Box display="flex" alignItems="center" gap={3} flexGrow={{ base: 1, md: 0 }}>
              <Box
                w="40px"
                h="40px"
                borderRadius="8px"
                bg={appColors.mist}
                display="flex"
                alignItems="center"
                justifyContent="center"
                color={appColors.sage}
                fontSize="xl"
              >
                <HiOutlineWallet />
              </Box>
              <Box display={{ base: "none", sm: "block" }}>
                <Text fontWeight={600} lineHeight={1.2} color={appColors.ink}>
                  Family Expense
                </Text>
                <Text fontSize="xs" color={appColors.inkMuted}>
                  Shared tracker
                </Text>
              </Box>
            </Box>
          </Link>

          <Box display={{ base: "none", md: "flex" }} gap={1} flex={1} ml={2}>
            {pages.map((p) => (
              <NavLink key={p.path} to={p.path} active={pathname === p.path}>
                {p.label}
              </NavLink>
            ))}
          </Box>

          <Menu.Root>
            <Menu.Trigger asChild>
              <IconButton display={{ md: "none" }} variant="ghost" aria-label="Menu" size="sm">
                <HiBars3 />
              </IconButton>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content borderRadius="12px" minW="180px" bg={appColors.paper} borderColor={appColors.border}>
                  {pages.map((p) => (
                    <Menu.Item key={p.path} value={p.path} asChild>
                      <Link to={p.path} style={{ textDecoration: "none", width: "100%" }}>
                        {p.label}
                      </Link>
                    </Menu.Item>
                  ))}
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>

          <IconButton variant="ghost" size="sm" onClick={toggleMode} aria-label="Toggle theme">
            {mode === "dark" ? <HiSun /> : <HiMoon />}
          </IconButton>

          {mounted && (
            <Box position="relative">
              <IconButton variant="ghost" size="sm" aria-label="Notifications">
                <HiBell />
              </IconButton>
              {unread > 0 && (
                <Badge
                  position="absolute"
                  top={0}
                  right={0}
                  size="sm"
                  colorPalette="red"
                  borderRadius="full"
                  minW="16px"
                  h="16px"
                  fontSize="10px"
                >
                  {unread}
                </Badge>
              )}
            </Box>
          )}

          {mounted && userName && (
            <Avatar.Root size="sm" display={{ base: "none", sm: "flex" }} bg={appColors.sageLight} color="white">
              <Avatar.Fallback fontWeight={600}>{initials}</Avatar.Fallback>
            </Avatar.Root>
          )}

          <Button variant="outline" size="sm" onClick={handleLogout} borderColor={appColors.border}>
            Logout
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
