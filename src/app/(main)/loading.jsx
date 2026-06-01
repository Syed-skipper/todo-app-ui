"use client";

import { Box, Skeleton } from "@chakra-ui/react";

export default function MainLoading() {
  return (
    <Box>
      <Skeleton height="40px" width="220px" mb={2} borderRadius="8px" />
      <Skeleton height="24px" width="320px" mb={6} borderRadius="8px" />
      <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={4} mb={6}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} height="110px" borderRadius="16px" />
        ))}
      </Box>
      <Skeleton height="280px" borderRadius="16px" />
    </Box>
  );
}
