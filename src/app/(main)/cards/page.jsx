"use client";

import { useEffect, useState } from "react";
import { Grid, Typography, Box, LinearProgress, Chip, Skeleton, Button } from "@mui/material";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import AddIcon from "@mui/icons-material/Add";
import PageHeader from "../../../components/PageHeader";
import AddCardModal from "../../../components/AddCardModal";
import { invalidateCache } from "../../../lib/simpleCache";
import { cardsApi } from "../../../lib/api";
import { fetchCards } from "../../../lib/referenceData";
import { appColors } from "../../../theme/theme";

const cardGradients = [
  "linear-gradient(135deg, #a4c3b2 0%, #6b9080 100%)",
  "linear-gradient(135deg, #b8c9d4 0%, #7a94a8 100%)",
  "linear-gradient(135deg, #d4c4b0 0%, #a8947a 100%)",
  "linear-gradient(135deg, #c4b8d4 0%, #8a7a9a 100%)",
  "linear-gradient(135deg, #b0d4c4 0%, #6a9a82 100%)",
  "linear-gradient(135deg, #c9d4b8 0%, #8a9a7a 100%)",
];

const calcUtil = (card) => {
  if (!card.creditLimit) return 0;
  const used = card.creditLimit - (card.availableBalance ?? card.creditLimit);
  return Math.round((used / card.creditLimit) * 100);
};

export default function CardsPage() {
  const [cards, setCards] = useState([]);
  const [summaries, setSummaries] = useState({});
  const [addCardOpen, setAddCardOpen] = useState(false);

  const loadCards = () => {
    invalidateCache("cards");
    fetchCards().then(setCards).catch(console.error);
    cardsApi
      .allWithSummaries()
      .then((r) => {
        const items = r.data.data?.summaries || [];
        const sums = {};
        items.forEach((item, i) => {
          const id = item.cardId || item.card?._id;
          if (id) {
            sums[id] = { ...item, gradient: cardGradients[i % cardGradients.length] };
          }
        });
        setSummaries(sums);
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadCards();
  }, []);

  return (
    <>
      <PageHeader
        title="Credit cards"
        subtitle="Monitor limits and usage calmly"
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddCardOpen(true)}>
            Add card
          </Button>
        }
      />
      <Grid container spacing={2.5}>
        {cards.length === 0
          ? [1, 2, 3].map((i) => (
              <Grid item xs={12} sm={6} lg={4} key={i}>
                <Skeleton variant="rounded" height={280} sx={{ borderRadius: 3 }} />
              </Grid>
            ))
          : cards.map((card, index) => {
              const summary = summaries[card._id];
              const util = summary?.utilizationPercent ?? calcUtil(card);
              const gradient = summary?.gradient || cardGradients[index % cardGradients.length];

              return (
                <Grid item xs={12} sm={6} lg={4} key={card._id}>
                  <Box
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      border: `1px solid ${appColors.border}`,
                      bgcolor: appColors.paper,
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 24px rgba(61, 74, 82, 0.08)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        background: gradient,
                        color: "#fff",
                        p: 2.5,
                        minHeight: 120,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <CreditCardOutlinedIcon sx={{ opacity: 0.9 }} />
                        <Chip
                          label={card.status}
                          size="small"
                          sx={{
                            bgcolor: "rgba(255,255,255,0.25)",
                            color: "#fff",
                            fontWeight: 500,
                            textTransform: "capitalize",
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {card.nickname}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          {card.bankName} · •••• {card.lastFourDigits}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ p: 2.5 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Available
                          </Typography>
                          <Typography fontWeight={600}>
                            ₹{(card.availableBalance ?? 0).toLocaleString("en-IN")}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                          <Typography variant="caption" color="text.secondary">
                            Limit
                          </Typography>
                          <Typography fontWeight={600}>
                            ₹{card.creditLimit?.toLocaleString("en-IN")}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
                        {util}% utilized
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(100, util)}
                        sx={{
                          mb: 2,
                          "& .MuiLinearProgress-bar": {
                            bgcolor: util > 80 ? appColors.warning : appColors.sage,
                          },
                        }}
                      />

                      {summary ? (
                        <Typography variant="body2" color="text.secondary">
                          This cycle:{" "}
                          <Typography component="span" fontWeight={600} color="text.primary">
                            ₹{summary.totalSpent?.toLocaleString("en-IN")}
                          </Typography>
                          {" "}· {summary.transactionCount} transactions
                        </Typography>
                      ) : (
                        <Skeleton variant="text" width="70%" />
                      )}
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                        Due day {card.dueDate} · Cycle {card.billingCycleStart}–{card.billingCycleEnd}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
      </Grid>

      {cards.length === 0 && (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            No credit cards added yet.
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddCardOpen(true)}>
            Add your first card
          </Button>
        </Box>
      )}

      <AddCardModal
        open={addCardOpen}
        onClose={() => setAddCardOpen(false)}
        onCreated={() => loadCards()}
      />
    </>
  );
}
