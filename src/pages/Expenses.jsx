import { useEffect, useState, useCallback } from "react";
import { Box, Button, Flex, Text, IconButton, Input } from "@chakra-ui/react";
import { HiPlus, HiArrowUpTray, HiPencil, HiTrash, HiMagnifyingGlass } from "react-icons/hi2";
import PageHeader from "../components/PageHeader";
import ExpenseModal from "../components/ExpenseModal";
import CategoryChip from "../components/ui/CategoryChip";
import PageLoading from "../components/ui/PageLoading";
import { FormSelect } from "../components/ui/form";
import { expensesApi } from "../lib/api";
import { fetchCards, fetchFamilyMembers } from "../lib/referenceData";
import { invalidateCache } from "../lib/simpleCache";
import { useDebounced } from "../hooks/useDebounced";
import { appColors } from "../theme/theme";

const CATEGORIES = [
  "Food", "Grocery", "Fuel", "Shopping", "EMI", "Bills",
  "Entertainment", "Travel", "Medical", "Other",
];

const emptyForm = {
  merchant: "",
  amount: "",
  category: "Food",
  cardId: "",
  splitType: "single",
  familyMemberId: "",
  memberIds: [],
  customAllocations: [{ familyMemberId: "", percent: "", amount: "" }],
  expenseDate: new Date().toISOString().slice(0, 16),
  notes: "",
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [cards, setCards] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [familyMemberId, setFamilyMemberId] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [importing, setImporting] = useState(false);
  const debouncedSearch = useDebounced(search, 350);

  const reloadCards = () => {
    invalidateCache("cards");
    fetchCards().then(setCards).catch(console.error);
  };

  useEffect(() => {
    Promise.all([fetchCards(), fetchFamilyMembers()])
      .then(([c, m]) => {
        setCards(c);
        setMembers(m);
      })
      .catch(console.error);
  }, []);

  const loadExpenses = useCallback(async () => {
    setLoading(true);
    const params = { limit: 50, sortBy: "expenseDate", sortOrder: "desc" };
    if (debouncedSearch) params.search = debouncedSearch;
    if (category) params.category = category;
    if (familyMemberId) params.familyMemberId = familyMemberId;
    if (filterMonth) {
      const [y, m] = filterMonth.split("-");
      params.year = y;
      params.month = m;
    }
    try {
      const expRes = await expensesApi.list(params);
      setExpenses(expRes.data.data || []);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, familyMemberId, filterMonth]);

  useEffect(() => {
    loadExpenses().catch(console.error);
  }, [loadExpenses]);

  const buildPayload = () => {
    const payload = {
      merchant: form.merchant,
      amount: parseFloat(form.amount),
      category: form.category,
      cardId: form.cardId,
      expenseDate: form.expenseDate,
      notes: form.notes,
      splitType: form.splitType || "single",
    };
    if (payload.splitType === "single") {
      payload.familyMemberId = form.familyMemberId;
    } else if (payload.splitType === "equal") {
      payload.memberIds = form.memberIds || [];
    } else {
      payload.customAllocations = (form.customAllocations || []).filter((r) => r.familyMemberId);
    }
    return payload;
  };

  const handleSubmit = async () => {
    const payload = buildPayload();
    if (editId) await expensesApi.update(editId, payload);
    else await expensesApi.create(payload);
    invalidateCache("cards");
    setOpen(false);
    setForm(emptyForm);
    setEditId(null);
    loadExpenses();
  };

  const handleEdit = (e) => {
    setEditId(e._id);
    const splitType = e.splitType || "single";
    const allocs = e.allocations || [];
    setForm({
      merchant: e.merchant,
      amount: e.amount,
      category: e.category,
      cardId: e.card?._id || e.card,
      splitType,
      familyMemberId:
        splitType === "single"
          ? allocs[0]?.familyMember?._id || allocs[0]?.familyMember || ""
          : "",
      memberIds: splitType === "equal" ? allocs.map((a) => a.familyMember?._id || a.familyMember) : [],
      customAllocations:
        splitType === "percent" || splitType === "custom"
          ? allocs.map((a) => ({
              familyMemberId: a.familyMember?._id || a.familyMember,
              percent: a.percent ?? "",
              amount: a.amount ?? "",
            }))
          : [{ familyMemberId: "", percent: "", amount: "" }],
      expenseDate: new Date(e.expenseDate).toISOString().slice(0, 16),
      notes: e.notes || "",
    });
    setOpen(true);
  };

  const handleImport = async (ev) => {
    const file = ev.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const res = await expensesApi.importCsv(file);
      alert(`Imported ${res.data.data?.imported || 0} transactions`);
      loadExpenses();
    } catch (err) {
      alert(err.response?.data?.message || "Import failed");
    } finally {
      setImporting(false);
      ev.target.value = "";
    }
  };

  const allocationSummary = (e) => {
    if (!e.allocations?.length) return "Unassigned";
    return e.allocations.map((a) => a.familyMember?.name || "?").join(", ");
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this expense?")) {
      await expensesApi.remove(id);
      invalidateCache("cards");
      loadExpenses();
    }
  };

  return (
    <>
      <PageHeader title="Expenses" subtitle="Track every transaction in one place" />
      <Flex
        gap={3}
        mb={6}
        flexWrap="wrap"
        p={4}
        bg={appColors.paper}
        borderRadius="16px"
        border="1px solid"
        borderColor={appColors.border}
        align="flex-end"
      >
        <Box flex={1} minW="200px" position="relative">
          <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" zIndex={1} color={appColors.inkMuted}>
            <HiMagnifyingGlass />
          </Box>
          <Input
            placeholder="Search merchant…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="md"
            borderRadius="12px"
            bg={appColors.paper}
            borderColor={appColors.border}
            pl={10}
          />
        </Box>
        <Box minW="140px">
          <FormSelect label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </FormSelect>
        </Box>
        <Box minW="140px">
          <FormSelect label="Member" value={familyMemberId} onChange={(e) => setFamilyMemberId(e.target.value)}>
            <option value="">All</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>{m.name}</option>
            ))}
          </FormSelect>
        </Box>
        <Box minW="150px">
          <Text fontSize="sm" color={appColors.inkMuted} mb={1}>Month</Text>
          <Input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            size="md"
            borderRadius="12px"
            borderColor={appColors.border}
            bg={appColors.paper}
          />
        </Box>
        <Button as="label" variant="outline" borderColor={appColors.border} cursor="pointer" disabled={importing}>
          <HiArrowUpTray /> Import CSV
          <input type="file" accept=".csv" hidden onChange={handleImport} />
        </Button>
        <Button bg={appColors.sage} color="white" _hover={{ bg: appColors.sageLight }} onClick={() => { setEditId(null); setForm(emptyForm); setOpen(true); }}>
          <HiPlus /> Add expense
        </Button>
      </Flex>

      {loading ? (
        <PageLoading />
      ) : expenses.length === 0 ? (
        <Box textAlign="center" py={12} bg={appColors.mist} borderRadius="16px" border="1px dashed" borderColor={appColors.border}>
          <Text color={appColors.inkMuted} mb={4}>No expenses yet. Add your first one to get started.</Text>
          <Button bg={appColors.sage} color="white" onClick={() => setOpen(true)}><HiPlus /> Add expense</Button>
        </Box>
      ) : (
        <Flex direction="column" gap={3}>
          {expenses.map((e) => (
            <Flex
              key={e._id}
              justify="space-between"
              align="center"
              flexWrap="wrap"
              gap={4}
              p={4}
              bg={appColors.paper}
              borderRadius="12px"
              border="1px solid"
              borderColor={appColors.border}
              _hover={{ borderColor: appColors.sageLight }}
              transition="border-color 0.2s"
            >
              <Flex align="center" gap={4} flex={1}>
                <Flex w="48px" h="48px" borderRadius="8px" bg={appColors.mist} align="center" justify="center" fontSize="xl" fontWeight={600} color={appColors.sage}>
                  {e.merchant?.[0]?.toUpperCase() || "?"}
                </Flex>
                <Box>
                  <Text fontWeight={600}>{e.merchant}</Text>
                  <Flex align="center" gap={2} mt={1} flexWrap="wrap">
                    <CategoryChip label={e.category} />
                    <Text fontSize="xs" color={appColors.inkMuted}>
                      {e.card?.nickname} · {allocationSummary(e)} ·{" "}
                      {new Date(e.expenseDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </Text>
                  </Flex>
                </Box>
              </Flex>
              <Flex align="center" gap={2}>
                <Text fontSize="lg" fontWeight={600} color={appColors.sage} mr={2}>
                  ₹{e.amount?.toLocaleString("en-IN")}
                </Text>
                <IconButton variant="ghost" size="sm" onClick={() => handleEdit(e)} aria-label="Edit">
                  <HiPencil />
                </IconButton>
                <IconButton variant="ghost" size="sm" onClick={() => handleDelete(e._id)} aria-label="Delete" _hover={{ color: appColors.error }}>
                  <HiTrash />
                </IconButton>
              </Flex>
            </Flex>
          ))}
        </Flex>
      )}

      <ExpenseModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        cards={cards}
        members={members}
        editMode={!!editId}
        onCardsUpdated={reloadCards}
      />
    </>
  );
}
