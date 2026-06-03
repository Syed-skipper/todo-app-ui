import { useEffect, useState } from "react";
import { Box, SimpleGrid, Text, Progress, Badge } from "@chakra-ui/react";
import { HiArrowTrendingUp, HiCreditCard, HiUser, HiChartPie } from "react-icons/hi2";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/ui/StatCard";
import SoftCard from "../components/ui/SoftCard";
import CategoryChip from "../components/ui/CategoryChip";
import PageLoading from "../components/ui/PageLoading";
import { analyticsApi, paymentsApi } from "../lib/api";
import { appColors } from "../theme/theme";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    Promise.all([analyticsApi.dashboard(), paymentsApi.upcoming(14)])
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
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={5}>
          <StatCard
            highlight
            label="Total family spend"
            value={formatCurrency(data.totalFamilySpend)}
            subtext={`${data.transactionCount} transactions this month`}
            icon={<HiArrowTrendingUp />}
          />
          <StatCard
            label="Highest spender"
            value={data.highestSpender?.member?.name || "—"}
            subtext={formatCurrency(data.highestSpender?.amount)}
            icon={<HiUser />}
          />
          <StatCard
            label="Most used card"
            value={data.mostUsedCard?.card?.nickname || "—"}
            subtext={formatCurrency(data.mostUsedCard?.amount)}
            icon={<HiCreditCard />}
          />
          <StatCard
            label="Outstanding"
            value={formatCurrency(data.totalOutstanding)}
            subtext={
              data.unallocated?.count
                ? `${data.unallocated.count} unassigned txn(s)`
                : "Due from family"
            }
            icon={<HiChartPie />}
          />

          <Box gridColumn={{ md: "span 2" }}>
            <SoftCard title="Who owes you" subtitle="This month">
              {(data.outstandingBalances || [])
                .filter((b) => b.outstanding > 0)
                .slice(0, 6)
                .map((b) => (
                  <Box
                    key={b.familyMember._id}
                    display="flex"
                    justifyContent="space-between"
                    py={2}
                    borderBottom="1px solid"
                    borderColor={appColors.border}
                    _last={{ borderBottom: "none" }}
                  >
                    <Text>{b.familyMember.name}</Text>
                    <Text fontWeight={600} color={appColors.error}>
                      {formatCurrency(b.outstanding)}
                    </Text>
                  </Box>
                ))}
              {(data.outstandingBalances || []).every((b) => b.outstanding <= 0) && (
                <Text fontSize="sm" color={appColors.inkMuted}>
                  All settled for this month
                </Text>
              )}
            </SoftCard>
          </Box>

          {data.budgetVsActual && (
            <Box gridColumn="1 / -1">
              <SoftCard title="Monthly budget" subtitle="Overall family limit">
                <Progress.Root value={Math.min(100, data.budgetVsActual.percentUsed)} max={100} size="sm" mb={3}>
                  <Progress.Track bg={appColors.mist} borderRadius="8px">
                    <Progress.Range
                      bg={data.budgetVsActual.percentUsed > 90 ? appColors.warning : appColors.sage}
                    />
                  </Progress.Track>
                </Progress.Root>
                <Box display="flex" justifyContent="space-between">
                  <Text fontSize="sm" color={appColors.inkMuted}>
                    Spent {formatCurrency(data.budgetVsActual.actual)}
                  </Text>
                  <Text fontSize="sm" color={appColors.inkMuted}>
                    of {formatCurrency(data.budgetVsActual.budget)}
                  </Text>
                </Box>
              </SoftCard>
            </Box>
          )}

          <Box>
            <SoftCard title="By category" subtitle="Where your money goes">
              {(data.categoryBreakdown || []).length === 0 ? (
                <Text fontSize="sm" color={appColors.inkMuted}>No expenses yet</Text>
              ) : (
                data.categoryBreakdown.map((c) => (
                  <Box
                    key={c._id}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    py={2}
                    borderBottom="1px solid"
                    borderColor={appColors.border}
                    _last={{ borderBottom: "none" }}
                  >
                    <CategoryChip label={c._id} />
                    <Text fontWeight={600}>{formatCurrency(c.total)}</Text>
                  </Box>
                ))
              )}
            </SoftCard>
          </Box>

          <Box>
            <SoftCard title="By member" subtitle="Who spent what">
              {(data.memberSpending || []).map((m) => (
                <Box
                  key={m.member?._id}
                  display="flex"
                  justifyContent="space-between"
                  py={2}
                  borderBottom="1px solid"
                  borderColor={appColors.border}
                  _last={{ borderBottom: "none" }}
                >
                  <Text>{m.member?.name}</Text>
                  <Text fontWeight={600}>{formatCurrency(m.total)}</Text>
                </Box>
              ))}
            </SoftCard>
          </Box>

          <Box gridColumn="1 / -1">
            <SoftCard title="Upcoming payments" subtitle="Due in the next 14 days">
              {upcoming.length === 0 ? (
                <Box py={6} textAlign="center" bg={appColors.mist} borderRadius="12px" opacity={0.8}>
                  <Text fontSize="sm" color={appColors.inkMuted}>
                    All clear — no upcoming dues
                  </Text>
                </Box>
              ) : (
                upcoming.map((p) => (
                  <Box
                    key={p._id}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={2}
                    py={3}
                    borderBottom="1px solid"
                    borderColor={appColors.border}
                    _last={{ borderBottom: "none" }}
                  >
                    <Box>
                      <Text fontWeight={500}>{p.card?.nickname}</Text>
                      <Text fontSize="xs" color={appColors.inkMuted}>
                        Due {new Date(p.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </Text>
                    </Box>
                    <Box display="flex" alignItems="center" gap={3}>
                      <Badge
                        bg={p.status === "overdue" ? `${appColors.error}33` : `${appColors.warning}55`}
                        color={p.status === "overdue" ? "#a86b64" : "#9a7b5c"}
                        px={2}
                        py={0.5}
                        borderRadius="8px"
                        textTransform="capitalize"
                      >
                        {p.status}
                      </Badge>
                      <Text fontWeight={600}>{formatCurrency(p.amountDue)}</Text>
                    </Box>
                  </Box>
                ))
              )}
            </SoftCard>
          </Box>
        </SimpleGrid>
      )}
    </>
  );
}
