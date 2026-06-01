"use client";

import { Box, Heading, Text } from "@chakra-ui/react";
import { appColors } from "../theme/theme";

export default function PageHeader({ title, subtitle, action }) {
  if (!title) return null;
  return (
    <Box mb={6} display="flex" justifyContent="space-between" alignItems="flex-start" gap={4} flexWrap="wrap">
      <Box>
        <Heading size="xl" fontWeight={600} color={appColors.ink} mb={subtitle ? 1 : 0}>
          {title}
        </Heading>
        {subtitle && (
          <Text color={appColors.inkMuted}>{subtitle}</Text>
        )}
      </Box>
      {action}
    </Box>
  );
}
