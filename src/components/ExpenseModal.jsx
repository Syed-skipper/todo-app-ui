"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
} from "@mui/material";

const CATEGORIES = [
  "Food", "Grocery", "Fuel", "Shopping", "EMI", "Bills",
  "Entertainment", "Travel", "Medical", "Other",
];

export default function ExpenseModal({
  open,
  onClose,
  onSubmit,
  form,
  setForm,
  cards = [],
  members = [],
  editMode = false,
}) {
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editMode ? "Edit Expense" : "Add Expense"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField fullWidth label="Merchant" name="merchant" value={form.merchant} onChange={handleChange} required />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="Amount (₹)" name="amount" type="number" value={form.amount} onChange={handleChange} required />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth select label="Category" name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth select label="Card" name="cardId" value={form.cardId} onChange={handleChange} required>
              {cards.map((c) => (
                <MenuItem key={c._id} value={c._id}>
                  {c.nickname} (*{c.lastFourDigits})
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth select label="Member" name="memberId" value={form.memberId} onChange={handleChange} required>
              {members.map((m) => (
                <MenuItem key={m._id} value={m._id}>{m.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Date"
              name="expenseDate"
              type="datetime-local"
              value={form.expenseDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Notes" name="notes" value={form.notes} onChange={handleChange} multiline rows={2} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSubmit}>{editMode ? "Update" : "Save"}</Button>
      </DialogActions>
    </Dialog>
  );
}
