"use client";

import { Box, LinearProgress, Typography } from "@mui/material";
import { appColors } from "../../theme/theme";

export default function PageLoading({ message = "Loading..." }) {
  return (
    <Box sx={{ py: 6, textAlign: 'center' }}>
      <LinearProgress
        sx={{
          maxWidth: 200,
          mx: 'auto',
          mb: 2,
          '& .MuiLinearProgress-bar': { bgcolor: appColors.sage },
        }}
      />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
