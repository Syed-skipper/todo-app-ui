import { useEffect, useState } from "react";
import { Box, Text, Stack, Flex } from "@chakra-ui/react";
import { HiLightBulb } from "react-icons/hi2";
import PageHeader from "../components/PageHeader";
import SoftCard from "../components/ui/SoftCard";
import PageLoading from "../components/ui/PageLoading";
import { analyticsApi } from "../lib/api";
import { appColors } from "../theme/theme";

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
            <Text fontSize="2xl" fontWeight={600} color={appColors.sage} mb={1}>
              ₹{insights.spendingPrediction?.nextMonthEstimate?.toLocaleString("en-IN")}
            </Text>
            <Text fontSize="sm" color={appColors.inkMuted}>
              Average monthly spend: ₹
              {Math.round(insights.spendingPrediction?.basedOnAverage || 0).toLocaleString("en-IN")}
            </Text>
          </SoftCard>

          {(insights.savingsSuggestions || []).map((s, i) => (
            <Flex key={i} gap={4} p={4} mb={3} bg={appColors.mist} borderRadius="12px" border="1px solid" borderColor={appColors.border}>
              <HiLightBulb color={appColors.sage} size={22} style={{ flexShrink: 0 }} />
              <Text fontSize="sm" lineHeight={1.6}>{s.message}</Text>
            </Flex>
          ))}

          <Box mt={6}>
            <SoftCard title="Recurring payments" subtitle="Merchants you visit often">
              {(insights.recurringPayments || []).length === 0 ? (
                <Text fontSize="sm" color={appColors.inkMuted}>None detected yet</Text>
              ) : (
                <Stack gap={0}>
                  {(insights.recurringPayments || []).map((r, i) => (
                    <Box
                      key={i}
                      py={3}
                      borderBottom={i < insights.recurringPayments.length - 1 ? "1px solid" : "none"}
                      borderColor={appColors.border}
                    >
                      <Text fontWeight={500}>{r._id?.merchant}</Text>
                      <Text fontSize="sm" color={appColors.inkMuted}>
                        {r.count} times · avg ₹{Math.round(r.avgAmount).toLocaleString("en-IN")}
                      </Text>
                    </Box>
                  ))}
                </Stack>
              )}
            </SoftCard>
          </Box>

          <Box mt={6}>
            <SoftCard title="Unusual activity" subtitle="Spending above your usual pattern">
              {(insights.unusualExpenses || []).length === 0 ? (
                <Box py={6} textAlign="center" bg={appColors.mist} borderRadius="12px">
                  <Text fontSize="sm" color={appColors.inkMuted}>
                    Everything looks normal — nothing unusual this month
                  </Text>
                </Box>
              ) : (
                insights.unusualExpenses.map((u) => (
                  <Box key={u.expenseId} py={3} borderBottom="1px solid" borderColor={appColors.border} _last={{ borderBottom: "none" }}>
                    <Text fontWeight={600}>
                      {u.merchant} — ₹{u.amount?.toLocaleString("en-IN")}
                    </Text>
                    <Text fontSize="sm" color={appColors.inkMuted} mt={1}>{u.reason}</Text>
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
