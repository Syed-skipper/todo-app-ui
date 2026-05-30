"use client";

import { useEffect, useState } from "react";
import { Typography, Box, List, ListItem, ListItemText, alpha } from "@mui/material";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import PageHeader from "../../../components/PageHeader";
import SoftCard from "../../../components/ui/SoftCard";
import PageLoading from "../../../components/ui/PageLoading";
import { analyticsApi } from "../../../lib/api";
import { appColors } from "../../../theme/theme";

export default function InsightsPage() {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    analyticsApi.insights().then((r) => setInsights(r.data.data)).catch(console.error);
  }, []);

  return (
    <>
      <PageHeader title="Insights" subtitle="Thoughtful patterns in your spending" />
      {!insights ? (
        <PageLoading />
      ) : (
      <>
      <SoftCard title="Next month estimate" subtitle="Based on your last 6 months">
        <Typography variant="h4" sx={{ fontWeight: 600, color: appColors.sage, mb: 0.5 }}>
          ₹{insights.spendingPrediction?.nextMonthEstimate?.toLocaleString("en-IN")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Average monthly spend: ₹
          {Math.round(insights.spendingPrediction?.basedOnAverage || 0).toLocaleString("en-IN")}
        </Typography>
      </SoftCard>

      {(insights.savingsSuggestions || []).map((s, i) => (
        <Box
          key={i}
          sx={{
            display: "flex",
            gap: 2,
            p: 2,
            mb: 1.5,
            bgcolor: alpha(appColors.mist, 0.6),
            borderRadius: 2.5,
            border: `1px solid ${appColors.border}`,
          }}
        >
          <LightbulbOutlinedIcon sx={{ color: appColors.sage, flexShrink: 0 }} />
          <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.6 }}>
            {s.message}
          </Typography>
        </Box>
      ))}

      <Box sx={{ mt: 2.5 }}>
        <SoftCard title="Recurring payments" subtitle="Merchants you visit often">
          {(insights.recurringPayments || []).length === 0 ? (
            <Typography variant="body2" color="text.secondary">None detected yet</Typography>
          ) : (
            <List disablePadding>
              {(insights.recurringPayments || []).map((r, i) => (
                <ListItem
                  key={i}
                  disableGutters
                  sx={{
                    py: 1.25,
                    borderBottom: i < insights.recurringPayments.length - 1 ? `1px solid ${appColors.border}` : "none",
                  }}
                >
                  <ListItemText
                    primary={r._id?.merchant}
                    secondary={`${r.count} times · avg ₹${Math.round(r.avgAmount).toLocaleString("en-IN")}`}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </SoftCard>
      </Box>

      <Box sx={{ mt: 2.5 }}>
        <SoftCard title="Unusual activity" subtitle="Spending above your usual pattern">
          {(insights.unusualExpenses || []).length === 0 ? (
            <Box
              sx={{
                py: 3,
                textAlign: "center",
                bgcolor: alpha(appColors.mist, 0.4),
                borderRadius: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Everything looks normal — nothing unusual this month
              </Typography>
            </Box>
          ) : (
            insights.unusualExpenses.map((u) => (
              <Box
                key={u.expenseId}
                sx={{
                  py: 1.5,
                  borderBottom: `1px solid ${appColors.border}`,
                  "&:last-child": { borderBottom: "none" },
                }}
              >
                <Typography fontWeight={600} color="text.primary">
                  {u.merchant} — ₹{u.amount?.toLocaleString("en-IN")}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                  {u.reason}
                </Typography>
              </Box>
            ))
          )}
        </SoftCard>
      </Box>
      </>
      )}
    </>
  );
}
