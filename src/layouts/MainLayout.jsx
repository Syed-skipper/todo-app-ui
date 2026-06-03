import { Navigate, Outlet } from "react-router-dom";
import { Box, Container } from "@chakra-ui/react";
import AppNav from "../components/AppNav";

export default function MainLayout() {
  if (typeof window !== "undefined" && !localStorage.getItem("token")) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box minH="100vh">
      <AppNav />
      <Container maxW="container.lg" py={{ base: 6, md: 8 }} px={{ base: 4, sm: 6 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
