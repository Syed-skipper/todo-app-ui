"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Typography,
  IconButton,
  Box,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { appColors } from "../theme/theme";
import AddCardModal from "./AddCardModal";

const CATEGORIES = [
  "Food", "Grocery", "Fuel", "Shopping", "EMI", "Bills",
  "Entertainment", "Travel", "Medical", "Other",
];

const INPUT_HEIGHT = 52;

const fieldSx = {
  width: "100%",
  "& .MuiOutlinedInput-root": {
    minHeight: INPUT_HEIGHT,
    borderRadius: "12px",
    bgcolor: appColors.paper,
    alignItems: "center",
  },
  "& .MuiOutlinedInput-input": {
    py: "14px",
    px: "14px",
    fontSize: "0.9375rem",
    boxSizing: "border-box",
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.9375rem",
    transform: "translate(14px, 16px) scale(1)",
    "&.Mui-focused, &.MuiFormLabel-filled, &.MuiInputLabel-shrink": {
      transform: "translate(14px, -9px) scale(0.75)",
    },
  },
  "& .MuiSelect-select": {
    minHeight: "24px !important",
    display: "flex",
    alignItems: "center",
  },
  '& input[type="datetime-local"]': {
    minHeight: 24,
    lineHeight: 1.5,
  },
};

function FormField({ sx, ...props }) {
  return <TextField variant="outlined" size="medium" sx={{ ...fieldSx, ...sx }} {...props} />;
}

function FormRow({ children }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
        width: "100%",
        "& > *": { flex: 1, minWidth: 0 },
      }}
    >
      {children}
    </Box>
  );
}

export default function ExpenseModal({
  open,
  onClose,
  onSubmit,
  form,
  setForm,
  cards = [],
  members = [],
  editMode = false,
  onCardsUpdated,
}) {
  const [addCardOpen, setAddCardOpen] = useState(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCardCreated = (card) => {
    onCardsUpdated?.();
    setForm((prev) => ({ ...prev, cardId: card._id }));
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: `1px solid ${appColors.border}`,
            maxWidth: 480,
          },
        }}
      >
        <DialogTitle sx={{ px: 3, pt: 2.5, pb: 1, pr: 6 }}>
          <Typography variant="h6" fontWeight={600}>
            {editMode ? "Edit expense" : "Add expense"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {editMode ? "Update transaction details" : "Record a new family expense"}
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", right: 12, top: 12 }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pt: 2, pb: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <FormField
              label="Merchant"
              name="merchant"
              value={form.merchant}
              onChange={handleChange}
              placeholder="e.g. Swiggy, Amazon"
              required
            />

            <FormRow>
              <FormField
                label="Amount (₹)"
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleChange}
                inputProps={{ min: 0, step: "0.01" }}
                required
              />
              <FormField
                select
                label="Category"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </FormField>
            </FormRow>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                alignItems: { sm: "flex-start" },
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
                <FormField
                  select
                  label="Card"
                  name="cardId"
                  value={form.cardId}
                  onChange={handleChange}
                  required
                  displayEmpty
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value="" disabled>
                    Select a card
                  </MenuItem>
                  {cards.map((c) => (
                    <MenuItem key={c._id} value={c._id}>
                      {c.nickname} (•••• {c.lastFourDigits})
                    </MenuItem>
                  ))}
                </FormField>
                {cards.length === 0 && (
                  <Alert severity="info" sx={{ mt: 1.5, borderRadius: 2 }}>
                    No cards yet. Tap &quot;New card&quot; to add one.
                  </Alert>
                )}
              </Box>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setAddCardOpen(true)}
                sx={{
                  minWidth: { sm: 128 },
                  width: { xs: "100%", sm: "auto" },
                  height: INPUT_HEIGHT,
                  flexShrink: 0,
                  borderColor: appColors.sageLight,
                  color: appColors.sage,
                  borderRadius: "12px",
                  "&:hover": { borderColor: appColors.sage, bgcolor: appColors.mist },
                }}
              >
                New card
              </Button>
            </Box>

            <FormField
              select
              label="Member"
              name="memberId"
              value={form.memberId}
              onChange={handleChange}
              required
              displayEmpty
            >
              <MenuItem value="" disabled>
                Who spent?
              </MenuItem>
              {members.map((m) => (
                <MenuItem key={m._id} value={m._id}>
                  {m.name}
                </MenuItem>
              ))}
            </FormField>

            <FormField
              label="Date & time"
              name="expenseDate"
              type="datetime-local"
              value={form.expenseDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{
                ...fieldSx,
                "& .MuiOutlinedInput-input": {
                  py: "13px",
                  px: "14px",
                },
              }}
            />

            <FormField
              label="Notes (optional)"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              multiline
              minRows={3}
              sx={{
                ...fieldSx,
                "& .MuiOutlinedInput-root": {
                  minHeight: "auto",
                  alignItems: "flex-start",
                  py: 0.5,
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2.5,
            pt: 0.5,
            gap: 1.5,
            "& > button": {
              m: 0,
              flex: 1,
              minHeight: 48,
              borderRadius: "12px",
              fontSize: "0.9375rem",
            },
          }}
        >
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button variant="contained" onClick={onSubmit} disabled={!form.cardId || !form.memberId}>
            {editMode ? "Save changes" : "Add expense"}
          </Button>
        </DialogActions>
      </Dialog>

      <AddCardModal
        open={addCardOpen}
        onClose={() => setAddCardOpen(false)}
        onCreated={handleCardCreated}
      />
    </>
  );
}
