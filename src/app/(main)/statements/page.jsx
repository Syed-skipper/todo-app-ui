"use client";

import { useEffect, useState } from "react";
import { Box, Text, SimpleGrid, Flex } from "@chakra-ui/react";
import PageHeader from "../../../components/PageHeader";
import StatCard from "../../../components/ui/StatCard";
import SoftCard from "../../../components/ui/SoftCard";
import CategoryChip from "../../../components/ui/CategoryChip";
import PageLoading from "../../../components/ui/PageLoading";
import { FormSelect } from "../../../components/ui/form";
import { settlementsApi } from "../../../lib/api";
import { fetchCards } from "../../../lib/referenceData";
import { appColors } from "../../../theme/theme";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function StatementsPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [cardId, setCardId] = useState("");
  const [cards, setCards] = useState([]);
  const [stmt, setStmt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCards().then(setCards).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { month, year };
    if (cardId) params.cardId = cardId;
    settlementsApi
      .statement(params)
      .then((r) => setStmt(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [month, year, cardId]);

  const format = (n) => `₹${(n || 0).toLocaleString("en-IN")}`;
  const years = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1];

  const allocLabel = (e) => {
    if (!e.allocations?.length) return "Unassigned";
    return e.allocations.map((a) => `${a.familyMember?.name || "?"} ${format(a.amount)}`).join(" + ");
  };

  return (
    <>
      <PageHeader title="Monthly statement" subtitle="Transactions by billing period" />

      <Flex gap={3} mb={6} flexWrap="wrap" align="flex-end">
        <Box minW="100px">
          <FormSelect label="Month" value={month} onChange={(e) => setMonth(+e.target.value)}>
            {monthNames.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </FormSelect>
        </Box>
        <Box minW="100px">
          <FormSelect label="Year" value={year} onChange={(e) => setYear(+e.target.value)}>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </FormSelect>
        </Box>
        <Box minW="180px">
          <FormSelect label="Card" value={cardId} onChange={(e) => setCardId(e.target.value)}>
            <option value="">All cards</option>
            {cards.map((c) => (
              <option key={c._id} value={c._id}>
                {c.nickname} •••• {c.lastFourDigits}
              </option>
            ))}
          </FormSelect>
        </Box>
      </Flex>

      {loading ? (
        <PageLoading />
      ) : stmt ? (
        <>
          <SimpleGrid columns={{ base: 1, sm: 3 }} gap={4} mb={6}>
            <StatCard label="Total spend" value={format(stmt.totalSpend)} />
            <StatCard label="Assigned" value={format(stmt.assignedTotal)} />
            <StatCard label="Unassigned" value={format(stmt.unassignedTotal)} highlight={stmt.unassignedTotal > 0} />
          </SimpleGrid>

          {stmt.byCard?.length > 0 && (
            <Box mb={6}>
              <SoftCard title="By card" subtitle="Spending breakdown">
                {stmt.byCard.map((row) => (
                  <Flex key={row.card?._id} justify="space-between" py={2}>
                    <Text>{row.card?.nickname || "Card"}</Text>
                    <Text fontWeight={600}>{format(row.total)} ({row.count} txns)</Text>
                  </Flex>
                ))}
              </SoftCard>
            </Box>
          )}

          <SoftCard title="Transactions" subtitle={`${stmt.expenses?.length || 0} items`}>
            {(stmt.expenses || []).map((e) => (
              <Box
                key={e._id}
                py={3}
                borderBottom="1px solid"
                borderColor={appColors.border}
                _last={{ borderBottom: "none" }}
              >
                <Flex justify="space-between" flexWrap="wrap" gap={2}>
                  <Box>
                    <Text fontWeight={600}>{e.merchant}</Text>
                    <Text fontSize="xs" color={appColors.inkMuted}>
                      {new Date(e.expenseDate).toLocaleDateString("en-IN")} · {e.card?.nickname}
                    </Text>
                  </Box>
                  <Text fontWeight={600} color={appColors.sage}>{format(e.amount)}</Text>
                </Flex>
                <Flex gap={2} mt={1} flexWrap="wrap" align="center">
                  <CategoryChip label={e.category} />
                  <Text fontSize="xs" color={e.allocations?.length ? appColors.inkMuted : appColors.warning}>
                    {allocLabel(e)}
                  </Text>
                </Flex>
              </Box>
            ))}
          </SoftCard>
        </>
      ) : null}
    </>
  );
}
