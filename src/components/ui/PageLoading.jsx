"use client";

import { Box, Progress, Text } from "@chakra-ui/react";
import { appColors } from "../../theme/theme";

export default function PageLoading({ message = "Loading..." }) {
  return (
    <Box py={12} textAlign="center">
      <Progress.Root value={null} maxW="200px" mx="auto" mb={4} size="sm">
        <Progress.Track bg={appColors.mist} borderRadius="8px">
          <Progress.Range bg={appColors.sage} />
        </Progress.Track>
      </Progress.Root>
      <Text fontSize="sm" color={appColors.inkMuted}>
        {message}
      </Text>
    </Box>
  );
}
