import { useEffect, useState } from "react";
import { Box, SimpleGrid, Text, Progress, Badge, Skeleton, Button, Flex } from "@chakra-ui/react";
import { HiCreditCard, HiPlus } from "react-icons/hi2";
import PageHeader from "../components/PageHeader";
import AddCardModal from "../components/AddCardModal";
import { invalidateCache } from "../lib/simpleCache";
import { cardsApi } from "../lib/api";
import { fetchCards } from "../lib/referenceData";
import { appColors } from "../theme/theme";

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
          if (id) sums[id] = { ...item, gradient: cardGradients[i % cardGradients.length] };
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
          <Button bg={appColors.sage} color="white" _hover={{ bg: appColors.sageLight }} onClick={() => setAddCardOpen(true)}>
            <HiPlus /> Add card
          </Button>
        }
      />
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={5}>
        {cards.length === 0
          ? [1, 2, 3].map((i) => <Skeleton key={i} height="280px" borderRadius="16px" />)
          : cards.map((card, index) => {
              const summary = summaries[card._id];
              const util = summary?.utilizationPercent ?? calcUtil(card);
              const gradient = summary?.gradient || cardGradients[index % cardGradients.length];

              return (
                <Box
                  key={card._id}
                  borderRadius="16px"
                  overflow="hidden"
                  border="1px solid"
                  borderColor={appColors.border}
                  bg={appColors.paper}
                  transition="transform 0.2s, box-shadow 0.2s"
                  _hover={{ transform: "translateY(-2px)", boxShadow: "0 8px 24px rgba(61, 74, 82, 0.08)" }}
                >
                  <Box background={gradient} color="white" p={5} minH="120px" display="flex" flexDirection="column" justifyContent="space-between">
                    <Flex justify="space-between" align="flex-start">
                      <HiCreditCard size={24} style={{ opacity: 0.9 }} />
                      <Badge bg="whiteAlpha.300" color="white" textTransform="capitalize">
                        {card.status}
                      </Badge>
                    </Flex>
                    <Box>
                      <Text fontSize="lg" fontWeight={600}>{card.nickname}</Text>
                      <Text fontSize="sm" opacity={0.9}>
                        {card.bankName} · •••• {card.lastFourDigits}
                      </Text>
                    </Box>
                  </Box>

                  <Box p={5}>
                    <Flex justify="space-between" mb={4}>
                      <Box>
                        <Text fontSize="xs" color={appColors.inkMuted}>Available</Text>
                        <Text fontWeight={600}>₹{(card.availableBalance ?? 0).toLocaleString("en-IN")}</Text>
                      </Box>
                      <Box textAlign="right">
                        <Text fontSize="xs" color={appColors.inkMuted}>Limit</Text>
                        <Text fontWeight={600}>₹{card.creditLimit?.toLocaleString("en-IN")}</Text>
                      </Box>
                    </Flex>

                    <Text fontSize="xs" color={appColors.inkMuted} mb={1}>{util}% utilized</Text>
                    <Progress.Root value={Math.min(100, util)} max={100} size="sm" mb={4}>
                      <Progress.Track bg={appColors.mist}>
                        <Progress.Range bg={util > 80 ? appColors.warning : appColors.sage} />
                      </Progress.Track>
                    </Progress.Root>

                    {summary ? (
                      <Text fontSize="sm" color={appColors.inkMuted}>
                        This cycle:{" "}
                        <Text as="span" fontWeight={600} color={appColors.ink}>
                          ₹{summary.totalSpent?.toLocaleString("en-IN")}
                        </Text>
                        {" "}· {summary.transactionCount} transactions
                      </Text>
                    ) : (
                      <Skeleton height="20px" width="70%" />
                    )}
                    <Text fontSize="xs" color={appColors.inkMuted} mt={2} display="block">
                      Due day {card.dueDate} · Cycle {card.billingCycleStart}–{card.billingCycleEnd}
                    </Text>
                  </Box>
                </Box>
              );
            })}
      </SimpleGrid>

      {cards.length === 0 && (
        <Box textAlign="center" py={10}>
          <Text color={appColors.inkMuted} mb={4}>No credit cards added yet.</Text>
          <Button bg={appColors.sage} color="white" onClick={() => setAddCardOpen(true)}>
            <HiPlus /> Add your first card
          </Button>
        </Box>
      )}

      <AddCardModal open={addCardOpen} onClose={() => setAddCardOpen(false)} onCreated={() => loadCards()} />
    </>
  );
}
