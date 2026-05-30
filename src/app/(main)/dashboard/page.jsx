"use client";

import { useEffect, useState } from "react";
import { Grid, Typography, Box, LinearProgress, Chip, alpha } from "@mui/material";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import PageHeader from "../../../components/PageHeader";
import StatCard from "../../../components/ui/StatCard";
import SoftCard from "../../../components/ui/SoftCard";
import CategoryChip from "../../../components/ui/CategoryChip";
import PageLoading from "../../../components/ui/PageLoading";
import { analyticsApi, paymentsApi } from "../../../lib/api";
import { appColors } from "../../../theme/theme";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    Promise.all([
      analyticsApi.dashboard(),
      paymentsApi.upcoming(14),
    ])
      .then(([dashRes, payRes]) => {
        setData(dashRes.data.data);
        setUpcoming(payRes.data.data || []);
      })
      .catch(console.error);
  }, []);

  const formatCurrency = (n) => `₹${(n || 0).toLocaleString("en-IN")}`;

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Your family's spending at a glance" />
      {!data ? (
        <PageLoading />
      ) : (
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            highlight
            label="Total family spend"
            value={formatCurrency(data.totalFamilySpend)}
            subtext={`${data.transactionCount} transactions this month`}
            icon={<TrendingUpOutlinedIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            label="Highest spender"
            value={data.highestSpender?.member?.name || "—"}
            subtext={formatCurrency(data.highestSpender?.amount)}
            icon={<PersonOutlineOutlinedIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            label="Most used card"
            value={data.mostUsedCard?.card?.nickname || "—"}
            subtext={formatCurrency(data.mostUsedCard?.amount)}
            icon={<CreditCardOutlinedIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            label="Budget usage"
            value={data.budgetVsActual ? `${data.budgetVsActual.percentUsed}%` : "—"}
            subtext={
              data.budgetVsActual
                ? `${formatCurrency(data.budgetVsActual.remaining)} remaining`
                : "No budget set"
            }
            icon={<PieChartOutlineOutlinedIcon />}
          />
        </Grid>

        {data.budgetVsActual && (
          <Grid item xs={12}>
            <SoftCard title="Monthly budget" subtitle="Overall family limit">
              <LinearProgress
                variant="determinate"
                value={Math.min(100, data.budgetVsActual.percentUsed)}
                sx={{
                  height: 10,
                  '& .MuiLinearProgress-bar': {
                    bgcolor:
                      data.budgetVsActual.percentUsed > 90
                        ? appColors.warning
                        : appColors.sage,
                  },
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Spent {formatCurrency(data.budgetVsActual.actual)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  of {formatCurrency(data.budgetVsActual.budget)}
                </Typography>
              </Box>
            </SoftCard>
          </Grid>
        )}

        <Grid item xs={12} md={6}>
          <SoftCard title="By category" subtitle="Where your money goes">
            {(data.categoryBreakdown || []).length === 0 ? (
              <Typography variant="body2" color="text.secondary">No expenses yet</Typography>
            ) : (
              (data.categoryBreakdown || []).map((c) => (
                <Box
                  key={c._id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 1.25,
                    borderBottom: `1px solid ${appColors.border}`,
                    "&:last-child": { borderBottom: "none" },
                  }}
                >
                  <CategoryChip label={c._id} />
                  <Typography fontWeight={600} color="text.primary">
                    {formatCurrency(c.total)}
                  </Typography>
                </Box>
              ))
            )}
          </SoftCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <SoftCard title="By member" subtitle="Who spent what">
            {(data.memberSpending || []).map((m) => (
              <Box
                key={m.member?._id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1.25,
                  borderBottom: `1px solid ${appColors.border}`,
                  "&:last-child": { borderBottom: "none" },
                }}
              >
                <Typography color="text.primary">{m.member?.name}</Typography>
                <Typography fontWeight={600}>{formatCurrency(m.total)}</Typography>
              </Box>
            ))}
          </SoftCard>
        </Grid>

        <Grid item xs={12}>
          <SoftCard title="Upcoming payments" subtitle="Due in the next 14 days">
            {upcoming.length === 0 ? (
              <Box
                sx={{
                  py: 3,
                  textAlign: "center",
                  bgcolor: alpha(appColors.mist, 0.5),
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  All clear — no upcoming dues
                </Typography>
              </Box>
            ) : (
              upcoming.map((p) => (
                <Box
                  key={p._id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1,
                    py: 1.5,
                    borderBottom: `1px solid ${appColors.border}`,
                    "&:last-child": { borderBottom: "none" },
                  }}
                >
                  <Box>
                    <Typography fontWeight={500}>{p.card?.nickname}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Due {new Date(p.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Chip
                      label={p.status}
                      size="small"
                      sx={{
                        bgcolor: p.status === "overdue" ? appColors.error + "22" : appColors.warning + "33",
                        color: p.status === "overdue" ? "#a86b64" : "#9a7b5c",
                        fontWeight: 500,
                      }}
                    />
                    <Typography fontWeight={600}>{formatCurrency(p.amountDue)}</Typography>
                  </Box>
                </Box>
              ))
            )}
          </SoftCard>
        </Grid>
      </Grid>
      )}
    </>
  );
}
