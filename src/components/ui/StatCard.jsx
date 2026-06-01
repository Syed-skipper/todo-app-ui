"use client";

import { Box, Card, Text } from "@chakra-ui/react";
import { appColors } from "../../theme/theme";

export default function StatCard({ label, value, subtext, highlight = false, icon }) {
  return (
    <Card.Root
      h="full"
      bg={highlight ? undefined : appColors.paper}
      background={highlight ? `linear-gradient(135deg, ${appColors.sage} 0%, #5a7d6e 100%)` : undefined}
      color={highlight ? "white" : "inherit"}
      border={highlight ? "none" : "1px solid"}
      borderColor={appColors.border}
      borderRadius="16px"
      boxShadow="0 2px 12px rgba(61, 74, 82, 0.04)"
    >
      <Card.Body p={5}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between">
          <Box>
            <Text fontSize="sm" color={highlight ? "whiteAlpha.800" : appColors.inkMuted} mb={1}>
              {label}
            </Text>
            <Text fontSize="xl" fontWeight={600} letterSpacing="-0.02em">
              {value}
            </Text>
            {subtext && (
              <Text fontSize="xs" mt={1} color={highlight ? "whiteAlpha.700" : appColors.inkMuted}>
                {subtext}
              </Text>
            )}
          </Box>
          {icon && (
            <Box
              w="44px"
              h="44px"
              borderRadius="8px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg={highlight ? "whiteAlpha.200" : appColors.mist}
              color={highlight ? "white" : appColors.sage}
              fontSize="xl"
            >
              {icon}
            </Box>
          )}
        </Box>
      </Card.Body>
    </Card.Root>
  );
}
