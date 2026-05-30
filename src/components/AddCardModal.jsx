"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  IconButton,
  Box,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { cardsApi } from "../lib/api";
import { invalidateCache } from "../lib/simpleCache";
import { appColors } from "../theme/theme";

const defaultForm = {
  nickname: "",
  bankName: "",
  lastFourDigits: "",
  creditLimit: "",
  billingCycleStart: "1",
  billingCycleEnd: "30",
  dueDate: "15",
};

const INPUT_HEIGHT = 52;

const fieldSx = {
  width: "100%",
  "& .MuiOutlinedInput-root": {
    minHeight: INPUT_HEIGHT,
    borderRadius: "12px",
    bgcolor: appColors.paper,
  },
  "& .MuiOutlinedInput-input": {
    py: "14px",
    px: "14px",
    fontSize: "0.9375rem",
  },
};

export default function AddCardModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleClose = () => {
    setForm(defaultForm);
    setError("");
    onClose();
  };

  const handleSubmit = async () => {
    setError("");
    setSaving(true);
    try {
      const creditLimit = parseFloat(form.creditLimit);
      const payload = {
        nickname: form.nickname.trim(),
        bankName: form.bankName.trim(),
        lastFourDigits: form.lastFourDigits,
        creditLimit,
        billingCycleStart: parseInt(form.billingCycleStart, 10),
        billingCycleEnd: parseInt(form.billingCycleEnd, 10),
        dueDate: parseInt(form.dueDate, 10),
        availableBalance: creditLimit,
      };
      const res = await cardsApi.create(payload);
      invalidateCache("cards");
      const card = res.data.data;
      onCreated?.(card);
      handleClose();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 403
          ? "Only admin can add cards. Ask your family admin."
          : "Could not add card. Check all fields.");
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ pr: 6, pb: 1 }}>
        <Typography variant="h6" fontWeight={600}>
          Add credit card
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Register a family card for expense tracking
        </Typography>
        <IconButton onClick={handleClose} sx={{ position: "absolute", right: 12, top: 12 }} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: 3, pt: 2, pb: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField variant="outlined" sx={fieldSx} label="Card nickname" name="nickname" value={form.nickname} onChange={handleChange} placeholder="e.g. HDFC Primary" required />
          <TextField variant="outlined" sx={fieldSx} label="Bank name" name="bankName" value={form.bankName} onChange={handleChange} placeholder="e.g. HDFC" required />
          <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" }, "& > *": { flex: 1, minWidth: 0 } }}>
            <TextField variant="outlined" sx={fieldSx} label="Last 4 digits" name="lastFourDigits" value={form.lastFourDigits} onChange={handleChange} inputProps={{ maxLength: 4 }} required />
            <TextField variant="outlined" sx={fieldSx} label="Credit limit (₹)" name="creditLimit" type="number" value={form.creditLimit} onChange={handleChange} required />
          </Box>
          <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" }, "& > *": { flex: 1, minWidth: 0 } }}>
            <TextField variant="outlined" sx={fieldSx} label="Billing cycle start (day)" name="billingCycleStart" type="number" value={form.billingCycleStart} onChange={handleChange} inputProps={{ min: 1, max: 31 }} required />
            <TextField variant="outlined" sx={fieldSx} label="Billing cycle end (day)" name="billingCycleEnd" type="number" value={form.billingCycleEnd} onChange={handleChange} inputProps={{ min: 1, max: 31 }} required />
          </Box>
          <TextField variant="outlined" sx={fieldSx} label="Payment due day" name="dueDate" type="number" value={form.dueDate} onChange={handleChange} inputProps={{ min: 1, max: 31 }} required />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, pt: 0, gap: 1.5 }}>
        <Button onClick={handleClose} variant="outlined" fullWidth disabled={saving}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" fullWidth disabled={saving}>
          {saving ? "Saving…" : "Add card"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
