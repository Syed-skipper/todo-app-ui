"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Container } from "@chakra-ui/react";
import AppNav from "../../components/AppNav";

export default function MainLayout({ children }) {
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <Box minH="100vh">
      <AppNav />
      <Container maxW="container.lg" py={{ base: 6, md: 8 }} px={{ base: 4, sm: 6 }}>
        {children}
      </Container>
    </Box>
  );
}
