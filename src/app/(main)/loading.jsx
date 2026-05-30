import { Box, Skeleton } from "@mui/material";

export default function MainLoading() {
  return (
    <Box>
      <Skeleton variant="text" width={220} height={40} sx={{ mb: 1 }} />
      <Skeleton variant="text" width={320} height={24} sx={{ mb: 3 }} />
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" }, gap: 2, mb: 3 }}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="rounded" height={110} sx={{ borderRadius: 2 }} />
        ))}
      </Box>
      <Skeleton variant="rounded" height={280} sx={{ borderRadius: 2 }} />
    </Box>
  );
}
