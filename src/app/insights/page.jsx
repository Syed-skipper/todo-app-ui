"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, Typography, Box, Alert, List, ListItem, ListItemText } from "@mui/material";
import AppLayout from "../../components/AppLayout";
import { analyticsApi } from "../../lib/api";

export default function InsightsPage() {
  const router = useRouter();
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) router.push("/login");
    analyticsApi.insights().then((r) => setInsights(r.data.data)).catch(console.error);
  }, [router]);

  if (!insights) return <AppLayout title="Smart Insights"><Typography>Loading...</Typography></AppLayout>;

  return (
    <AppLayout title="Smart Insights">
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">Spending Prediction</Typography>
          <Typography>
            Next month estimate: ₹{insights.spendingPrediction?.nextMonthEstimate?.toLocaleString("en-IN")}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Based on 6-month average: ₹{Math.round(insights.spendingPrediction?.basedOnAverage || 0).toLocaleString("en-IN")}
          </Typography>
        </CardContent>
      </Card>

      {insights.savingsSuggestions?.map((s, i) => (
        <Alert key={i} severity="info" sx={{ mb: 1 }}>{s.message}</Alert>
      ))}

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Recurring Payments</Typography>
          <List dense>
            {(insights.recurringPayments || []).map((r, i) => (
              <ListItem key={i}>
                <ListItemText
                  primary={r._id?.merchant}
                  secondary={`${r.count} times · avg ₹${Math.round(r.avgAmount)}`}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Unusual Expenses</Typography>
          {(insights.unusualExpenses || []).length === 0 ? (
            <Typography color="textSecondary">No unusual activity detected</Typography>
          ) : (
            insights.unusualExpenses.map((u) => (
              <Box key={u.expenseId} sx={{ py: 1, borderBottom: "1px solid #eee" }}>
                <Typography fontWeight={600}>{u.merchant} — ₹{u.amount}</Typography>
                <Typography variant="body2" color="textSecondary">{u.reason}</Typography>
              </Box>
            ))
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
