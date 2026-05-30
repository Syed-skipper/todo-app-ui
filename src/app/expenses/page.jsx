"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button, Card, CardContent, Typography, Box, TextField, MenuItem, IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AppLayout from "../../components/AppLayout";
import ExpenseModal from "../../components/ExpenseModal";
import { expensesApi, cardsApi, membersApi } from "../../lib/api";

const emptyForm = {
  merchant: "", amount: "", category: "Food", cardId: "", memberId: "",
  expenseDate: new Date().toISOString().slice(0, 16), notes: "",
};

export default function ExpensesPage() {
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [cards, setCards] = useState([]);
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const load = async () => {
    const params = { limit: 50, sortBy: "expenseDate", sortOrder: "desc" };
    if (search) params.search = search;
    if (category) params.category = category;
    const [expRes, cardRes, memRes] = await Promise.all([
      expensesApi.list(params),
      cardsApi.list(),
      membersApi.list(),
    ]);
    setExpenses(expRes.data.data || []);
    setCards(cardRes.data.data || []);
    setMembers(memRes.data.data || []);
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) router.push("/login");
    else load().catch(console.error);
  }, [router, search, category]);

  const handleSubmit = async () => {
    const payload = {
      ...form,
      amount: parseFloat(form.amount),
      memberId: form.memberId || localStorage.getItem("user_id"),
    };
    if (editId) await expensesApi.update(editId, payload);
    else await expensesApi.create(payload);
    setOpen(false);
    setForm(emptyForm);
    setEditId(null);
    load();
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
      load();
    }
  };

  return (
    <AppLayout title="Expenses">
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField size="small" label="Search merchant" value={search} onChange={(e) => setSearch(e.target.value)} />
        <TextField size="small" select label="Category" value={category} onChange={(e) => setCategory(e.target.value)} sx={{ minWidth: 140 }}>
          <MenuItem value="">All</MenuItem>
          {["Food", "Grocery", "Fuel", "Shopping", "EMI", "Bills", "Entertainment", "Travel", "Medical", "Other"].map((c) => (
            <MenuItem key={c} value={c}>{c}</MenuItem>
          ))}
        </TextField>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditId(null); setForm({ ...emptyForm, memberId: localStorage.getItem("user_id") }); setOpen(true); }}>
          Add Expense
        </Button>
      </Box>

      {expenses.map((e) => (
        <Card key={e._id} sx={{ mb: 1.5 }}>
          <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: "12px !important" }}>
            <Box>
              <Typography fontWeight={600}>{e.merchant}</Typography>
              <Typography variant="body2" color="textSecondary">
                {e.category} · {e.card?.nickname} · {e.member?.name} · {new Date(e.expenseDate).toLocaleDateString()}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography fontWeight={700}>₹{e.amount?.toLocaleString("en-IN")}</Typography>
              <IconButton size="small" onClick={() => handleEdit(e)}><EditIcon fontSize="small" /></IconButton>
              <IconButton size="small" color="error" onClick={() => handleDelete(e._id)}><DeleteIcon fontSize="small" /></IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}

      <ExpenseModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        cards={cards}
        members={members}
        editMode={!!editId}
      />
    </AppLayout>
  );
}
