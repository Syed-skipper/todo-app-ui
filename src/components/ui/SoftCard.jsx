"use client";

import { Card, CardContent, Typography, Box } from "@mui/material";

export default function SoftCard({ title, subtitle, children, action, noPadding }) {
  return (
    <Card>
      <CardContent sx={{ p: noPadding ? 0 : 2.5, '&:last-child': { pb: noPadding ? 0 : 2.5 } }}>
        {(title || action) && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: subtitle || children ? 2 : 0,
              px: noPadding ? 2.5 : 0,
              pt: noPadding ? 2.5 : 0,
            }}
          >
            <Box>
              {title && (
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {title}
                </Typography>
              )}
              {subtitle && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
            {action}
          </Box>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
