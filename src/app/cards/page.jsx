"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, Grid, Typography, Box, LinearProgress, Chip } from "@mui/material";
import AppLayout from "../../components/AppLayout";
import { cardsApi } from "../../lib/api";

export default function CardsPage() {
  const router = useRouter();
  const [cards, setCards] = useState([]);
  const [summaries, setSummaries] = useState({});

  useEffect(() => {
    if (!localStorage.getItem("token")) router.push("/login");
    cardsApi.list().then(async (r) => {
      const list = r.data.data || [];
      setCards(list);
      const sums = {};
      await Promise.all(
        list.map(async (c) => {
          const s = await cardsApi.summary(c._id);
          sums[c._id] = s.data.data;
        })
      );
      setSummaries(sums);
    }).catch(console.error);
  }, [router]);

  return (
    <AppLayout title="Credit Cards">
      <Grid container spacing={3}>
        {cards.map((card) => {
          const summary = summaries[card._id];
          const util = summary?.utilizationPercent ?? 0;
          const used = (card.creditLimit || 0) - (card.availableBalance ?? 0);
          return (
            <Grid item xs={12} md={6} lg={4} key={card._id}>
              <Card sx={{ borderTop: `4px solid ${card.color || "#1976d2"}` }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="h6">{card.nickname}</Typography>
                    <Chip label={card.status} size="small" color={card.status === "active" ? "success" : "default"} />
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    {card.bankName} · **** {card.lastFourDigits}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Limit: ₹{card.creditLimit?.toLocaleString("en-IN")}
                  </Typography>
                  <Typography variant="body2">
                    Available: ₹{(card.availableBalance ?? 0).toLocaleString("en-IN")}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption">Utilization {util}%</Typography>
                    <LinearProgress variant="determinate" value={Math.min(100, util)} color={util > 80 ? "error" : "primary"} />
                  </Box>
                  {summary && (
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      This cycle: ₹{summary.totalSpent?.toLocaleString("en-IN")} ({summary.transactionCount} txns)
                    </Typography>
                  )}
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Due day: {card.dueDate} · Cycle: {card.billingCycleStart}–{card.billingCycleEnd}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </AppLayout>
  );
}
