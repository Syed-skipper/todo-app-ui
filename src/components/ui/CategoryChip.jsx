"use client";

import { Badge } from "@chakra-ui/react";
import { categoryColors } from "../../theme/theme";

export default function CategoryChip({ label }) {
  const colors = categoryColors[label] || categoryColors.Other;
  return (
    <Badge
      px={2}
      py={0.5}
      borderRadius="8px"
      fontWeight={500}
      fontSize="xs"
      bg={colors.bg}
      color={colors.color}
    >
      {label}
    </Badge>
  );
}
