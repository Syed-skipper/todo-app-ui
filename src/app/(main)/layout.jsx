"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Container } from "@mui/material";
import AppNav from "../../components/AppNav";

export default function MainLayout({ children }) {
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <AppNav />
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
        {children}
      </Container>
    </Box>
  );
}
