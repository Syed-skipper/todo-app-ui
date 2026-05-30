"use client";

import { Chip } from "@mui/material";
import { categoryColors } from "../../theme/theme";

export default function CategoryChip({ label, size = "small" }) {
  const colors = categoryColors[label] || categoryColors.Other;
  return (
    <Chip
      label={label}
      size={size}
      sx={{
        bgcolor: colors.bg,
        color: colors.color,
        fontWeight: 500,
        border: 'none',
      }}
    />
  );
}
