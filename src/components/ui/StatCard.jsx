"use client";

import { Box, Card, CardContent, Typography } from "@mui/material";
import { appColors } from "../../theme/theme";

export default function StatCard({ label, value, subtext, highlight = false, icon }) {
  return (
    <Card
      sx={{
        height: '100%',
        background: highlight
          ? `linear-gradient(135deg, ${appColors.sage} 0%, #5a7d6e 100%)`
          : appColors.paper,
        border: highlight ? 'none' : undefined,
        color: highlight ? '#fff' : 'inherit',
        '& .MuiTypography-root': highlight ? { color: 'inherit' } : {},
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography
              variant="body2"
              sx={{
                opacity: highlight ? 0.9 : 1,
                color: highlight ? 'rgba(255,255,255,0.85)' : 'text.secondary',
                mb: 0.5,
                fontSize: '0.8rem',
              }}
            >
              {label}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
              {value}
            </Typography>
            {subtext && (
              <Typography
                variant="caption"
                sx={{
                  mt: 0.5,
                  display: 'block',
                  color: highlight ? 'rgba(255,255,255,0.75)' : 'text.secondary',
                }}
              >
                {subtext}
              </Typography>
            )}
          </Box>
          {icon && (
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: highlight ? 'rgba(255,255,255,0.15)' : appColors.mist,
                color: highlight ? '#fff' : appColors.sage,
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
