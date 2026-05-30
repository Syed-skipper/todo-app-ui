"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Button,
  Typography,
  Box,
  TextField,
  MenuItem,
  IconButton,
  InputAdornment,
  alpha,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SearchIcon from "@mui/icons-material/Search";
import PageHeader from "../../../components/PageHeader";
import ExpenseModal from "../../../components/ExpenseModal";
import CategoryChip from "../../../components/ui/CategoryChip";
import PageLoading from "../../../components/ui/PageLoading";
import { expensesApi } from "../../../lib/api";
import { fetchCards, fetchMembers } from "../../../lib/referenceData";
import { invalidateCache } from "../../../lib/simpleCache";
import { useDebounced } from "../../../hooks/useDebounced";
import { appColors } from "../../../theme/theme";

const CATEGORIES = [
  "Food", "Grocery", "Fuel", "Shopping", "EMI", "Bills",
  "Entertainment", "Travel", "Medical", "Other",
];

const emptyForm = {
  merchant: "", amount: "", category: "Food", cardId: "", memberId: "",
  expenseDate: new Date().toISOString().slice(0, 16), notes: "",
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
  const debouncedSearch = useDebounced(search, 350);

  const reloadCards = () => {
    invalidateCache("cards");
    fetchCards().then(setCards).catch(console.error);
  };

  useEffect(() => {
    Promise.all([fetchCards(), fetchMembers()])
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
    try {
      const expRes = await expensesApi.list(params);
      setExpenses(expRes.data.data || []);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category]);

  useEffect(() => {
    loadExpenses().catch(console.error);
  }, [loadExpenses]);

  const handleSubmit = async () => {
    const payload = {
      ...form,
      amount: parseFloat(form.amount),
      memberId: form.memberId || localStorage.getItem("user_id"),
    };
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
    setForm({
      merchant: e.merchant,
      amount: e.amount,
      category: e.category,
      cardId: e.card?._id || e.card,
      memberId: e.member?._id || e.member,
      expenseDate: new Date(e.expenseDate).toISOString().slice(0, 16),
      notes: e.notes || "",
    });
    setOpen(true);
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
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
          p: 2,
          bgcolor: appColors.paper,
          borderRadius: 3,
          border: `1px solid ${appColors.border}`,
        }}
      >
        <TextField
          size="small"
          placeholder="Search merchant…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1, minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: appColors.inkMuted }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          size="small"
          select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">All</MenuItem>
          {CATEGORIES.map((c) => (
            <MenuItem key={c} value={c}>{c}</MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditId(null);
            setForm({ ...emptyForm, memberId: localStorage.getItem("user_id") });
            setOpen(true);
          }}
        >
          Add expense
        </Button>
      </Box>

      {loading ? (
        <PageLoading />
      ) : expenses.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            bgcolor: alpha(appColors.mist, 0.4),
            borderRadius: 3,
            border: `1px dashed ${appColors.border}`,
          }}
        >
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            No expenses yet. Add your first one to get started.
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            Add expense
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {expenses.map((e) => (
            <Box
              key={e._id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                p: 2,
                bgcolor: appColors.paper,
                borderRadius: 2.5,
                border: `1px solid ${appColors.border}`,
                transition: "border-color 0.2s",
                "&:hover": { borderColor: appColors.sageLight },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: appColors.mist,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: appColors.sage,
                  }}
                >
                  {e.merchant?.[0]?.toUpperCase() || "?"}
                </Box>
                <Box>
                  <Typography fontWeight={600} color="text.primary">
                    {e.merchant}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5, flexWrap: "wrap" }}>
                    <CategoryChip label={e.category} />
                    <Typography variant="caption" color="text.secondary">
                      {e.card?.nickname} · {e.member?.name} ·{" "}
                      {new Date(e.expenseDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: appColors.sage, mr: 1 }}>
                  ₹{e.amount?.toLocaleString("en-IN")}
                </Typography>
                <IconButton size="small" onClick={() => handleEdit(e)}>
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDelete(e._id)}
                  sx={{ "&:hover": { color: appColors.error } }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
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
