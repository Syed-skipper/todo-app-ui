"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, Typography, Box, LinearProgress, Chip } from "@mui/material";
import AppLayout from "../../components/AppLayout";
import { budgetsApi } from "../../lib/api";

export default function BudgetsPage() {
  const router = useRouter();
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("token")) router.push("/login");
    budgetsApi.list().then((r) => setBudgets(r.data.data || [])).catch(console.error);
  }, [router]);

  const statusColor = { ok: "success", warning: "warning", exceeded: "error" };

  return (
    <AppLayout title="Budgets">
      {budgets.length === 0 ? (
        <Typography color="textSecondary">No budgets set for this month. Admin can create budgets via API.</Typography>
      ) : (
        budgets.map((b) => (
          <Card key={b._id} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography fontWeight={600} textTransform="capitalize">{b.type} Budget</Typography>
                <Chip label={b.status} color={statusColor[b.status] || "default"} size="small" />
              </Box>
              <Typography variant="body2" color="textSecondary">
                {b.member?.name || b.card?.nickname || b.category || "Family overall"} · {b.month}/{b.year}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                <Typography>Spent: ₹{b.spent?.toLocaleString("en-IN")}</Typography>
                <Typography>Budget: ₹{b.amount?.toLocaleString("en-IN")}</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min(100, b.percentUsed || 0)}
                color={b.status === "exceeded" ? "error" : b.status === "warning" ? "warning" : "primary"}
                sx={{ mt: 1, height: 8, borderRadius: 1 }}
              />
              <Typography variant="caption">Remaining: ₹{b.remaining?.toLocaleString("en-IN")}</Typography>
            </CardContent>
          </Card>
        ))
      )}
    </AppLayout>
  );
}
