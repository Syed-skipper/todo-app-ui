"use client";

import { useEffect, useState } from "react";
import { Typography, Box, LinearProgress, Chip, Grid, alpha } from "@mui/material";
import PageHeader from "../../../components/PageHeader";
import PageLoading from "../../../components/ui/PageLoading";
import { budgetsApi } from "../../../lib/api";
import { appColors } from "../../../theme/theme";

const statusStyles = {
  ok: { bg: appColors.mist, color: appColors.sage, label: "On track" },
  warning: { bg: "#faf3eb", color: "#9a7b5c", label: "Near limit" },
  exceeded: { bg: "#faf0ee", color: "#a86b64", label: "Exceeded" },
};

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    budgetsApi
      .list()
      .then((r) => {
        setBudgets(r.data.data || []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <PageHeader title="Budgets" subtitle="Gentle limits to keep spending mindful" />
      {loading ? (
        <PageLoading />
      ) : budgets.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            bgcolor: alpha(appColors.mist, 0.4),
            borderRadius: 3,
            border: `1px dashed ${appColors.border}`,
          }}
        >
          <Typography color="text.secondary">
            No budgets set for this month yet.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2.5}>
          {budgets.map((b) => {
            const style = statusStyles[b.status] || statusStyles.ok;
            return (
              <Grid item xs={12} md={6} key={b._id}>
                <Box
                  sx={{
                    p: 2.5,
                    bgcolor: appColors.paper,
                    borderRadius: 3,
                    border: `1px solid ${appColors.border}`,
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                    <Box>
                      <Typography fontWeight={600} textTransform="capitalize" color="text.primary">
                        {b.type} budget
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {b.member?.name || b.card?.nickname || b.category || "Family overall"}
                        {" · "}
                        {b.month}/{b.year}
                      </Typography>
                    </Box>
                    <Chip
                      label={style.label}
                      size="small"
                      sx={{ bgcolor: style.bg, color: style.color, fontWeight: 500 }}
                    />
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Spent ₹{b.spent?.toLocaleString("en-IN")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      of ₹{b.amount?.toLocaleString("en-IN")}
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, b.percentUsed || 0)}
                    sx={{
                      height: 10,
                      mb: 1,
                      "& .MuiLinearProgress-bar": {
                        bgcolor:
                          b.status === "exceeded"
                            ? appColors.error
                            : b.status === "warning"
                              ? appColors.warning
                              : appColors.sage,
                      },
                    }}
                  />

                  <Typography variant="caption" color="text.secondary">
                    ₹{b.remaining?.toLocaleString("en-IN")} remaining · {b.percentUsed}% used
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      )}
    </>
  );
}
