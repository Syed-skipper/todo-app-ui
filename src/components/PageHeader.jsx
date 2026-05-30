"use client";

import { Box, Typography } from "@mui/material";
import { appColors } from "../theme/theme";

export default function PageHeader({ title, subtitle, action }) {
  if (!title) return null;
  return (
    <Box
      sx={{
        mb: 3.5,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 600, color: appColors.ink, mb: subtitle ? 0.5 : 0 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      {action}
    </Box>
  );
}
