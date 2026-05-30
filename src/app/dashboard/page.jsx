"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, Grid, Typography, Box, LinearProgress, Chip } from "@mui/material";
import AppLayout from "../../components/AppLayout";
import { analyticsApi, paymentsApi } from "../../lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
      return;
    }
    analyticsApi.dashboard().then((r) => setData(r.data.data)).catch(console.error);
    paymentsApi.upcoming(14).then((r) => setUpcoming(r.data.data || [])).catch(console.error);
  }, [router]);

  if (!data) {
    return (
      <AppLayout title="Monthly Dashboard">
        <LinearProgress />
      </AppLayout>
    );
  }

  const formatCurrency = (n) => `₹${(n || 0).toLocaleString("en-IN")}`;

  return (
    <AppLayout title="Monthly Dashboard">
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: "#0f172a", color: "white" }}>
            <CardContent>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>Total Family Spend</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{formatCurrency(data.totalFamilySpend)}</Typography>
              <Typography variant="caption">{data.transactionCount} transactions</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" variant="body2">Highest Spender</Typography>
              <Typography variant="h6">{data.highestSpender?.member?.name || "—"}</Typography>
              <Typography variant="body2">{formatCurrency(data.highestSpender?.amount)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" variant="body2">Most Used Card</Typography>
              <Typography variant="h6">{data.mostUsedCard?.card?.nickname || "—"}</Typography>
              <Typography variant="body2">{formatCurrency(data.mostUsedCard?.amount)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" variant="body2">Budget vs Actual</Typography>
              {data.budgetVsActual ? (
                <>
                  <Typography variant="h6">{data.budgetVsActual.percentUsed}% used</Typography>
                  <LinearProgress variant="determinate" value={Math.min(100, data.budgetVsActual.percentUsed)} sx={{ mt: 1 }} />
                </>
              ) : (
                <Typography variant="body2">No overall budget set</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Category Breakdown</Typography>
              {(data.categoryBreakdown || []).map((c) => (
                <Box key={c._id} sx={{ display: "flex", justifyContent: "space-between", py: 1, borderBottom: "1px solid #eee" }}>
                  <Chip label={c._id} size="small" />
                  <Typography>{formatCurrency(c.total)}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Member Spending</Typography>
              {(data.memberSpending || []).map((m) => (
                <Box key={m.member?._id} sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
                  <Typography>{m.member?.name}</Typography>
                  <Typography fontWeight={600}>{formatCurrency(m.total)}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Upcoming Bill Payments</Typography>
              {upcoming.length === 0 ? (
                <Typography color="textSecondary">No upcoming dues in the next 14 days</Typography>
              ) : (
                upcoming.map((p) => (
                  <Box key={p._id} sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
                    <Typography>{p.card?.nickname} — Due {new Date(p.dueDate).toLocaleDateString()}</Typography>
                    <Chip label={p.status} color={p.status === "overdue" ? "error" : "warning"} size="small" />
                    <Typography fontWeight={600}>{formatCurrency(p.amountDue)}</Typography>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AppLayout>
  );
}
