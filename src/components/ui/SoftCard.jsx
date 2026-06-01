"use client";

import { Box, Card, Heading, Text } from "@chakra-ui/react";
import { appColors } from "../../theme/theme";

export default function SoftCard({ title, subtitle, children, action, noPadding }) {
  return (
    <Card.Root borderRadius="16px" border="1px solid" borderColor={appColors.border} bg={appColors.paper}>
      <Card.Body p={noPadding ? 0 : 5}>
        {(title || action) && (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            mb={subtitle || children ? 4 : 0}
            px={noPadding ? 5 : 0}
            pt={noPadding ? 5 : 0}
          >
            <Box>
              {title && (
                <Heading size="md" fontWeight={600} color={appColors.ink}>
                  {title}
                </Heading>
              )}
              {subtitle && (
                <Text fontSize="sm" color={appColors.inkMuted} mt={1}>
                  {subtitle}
                </Text>
              )}
            </Box>
            {action}
          </Box>
        )}
        {children}
      </Card.Body>
    </Card.Root>
  );
}
