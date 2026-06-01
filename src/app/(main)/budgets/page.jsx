"use client";

import { useEffect, useState } from "react";
import { Box, Text, Progress, Badge, SimpleGrid, Flex } from "@chakra-ui/react";
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
        <Box textAlign="center" py={12} bg={appColors.mist} borderRadius="16px" border="1px dashed" borderColor={appColors.border}>
          <Text color={appColors.inkMuted}>No budgets set for this month yet.</Text>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
          {budgets.map((b) => {
            const style = statusStyles[b.status] || statusStyles.ok;
            return (
              <Box key={b._id} p={5} bg={appColors.paper} borderRadius="16px" border="1px solid" borderColor={appColors.border}>
                <Flex justify="space-between" mb={3}>
                  <Box>
                    <Text fontWeight={600} textTransform="capitalize">{b.type} budget</Text>
                    <Text fontSize="sm" color={appColors.inkMuted}>
                      {b.member?.name || b.card?.nickname || b.category || "Family overall"}
                      {" · "}
                      {b.month}/{b.year}
                    </Text>
                  </Box>
                  <Badge bg={style.bg} color={style.color} px={2} py={0.5} borderRadius="8px">
                    {style.label}
                  </Badge>
                </Flex>
                <Flex justify="space-between" mb={2}>
                  <Text fontSize="sm" color={appColors.inkMuted}>Spent ₹{b.spent?.toLocaleString("en-IN")}</Text>
                  <Text fontSize="sm" color={appColors.inkMuted}>of ₹{b.amount?.toLocaleString("en-IN")}</Text>
                </Flex>
                <Progress.Root value={Math.min(100, b.percentUsed || 0)} max={100} size="sm" mb={2}>
                  <Progress.Track bg={appColors.mist}>
                    <Progress.Range
                      bg={b.status === "exceeded" ? appColors.error : b.status === "warning" ? appColors.warning : appColors.sage}
                    />
                  </Progress.Track>
                </Progress.Root>
                <Text fontSize="xs" color={appColors.inkMuted}>
                  ₹{b.remaining?.toLocaleString("en-IN")} remaining · {b.percentUsed}% used
                </Text>
              </Box>
            );
          })}
        </SimpleGrid>
      )}
    </>
  );
}
