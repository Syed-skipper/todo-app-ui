"use client";

import { useState } from "react";
import { Box, Button, Alert, Flex, Stack } from "@chakra-ui/react";
import { HiPlus } from "react-icons/hi2";
import AppModal from "./ui/AppModal";
import { FormInput, FormSelect, FormTextarea } from "./ui/form";
import AddCardModal from "./AddCardModal";
import SplitAllocationFields from "./SplitAllocationFields";
import { appColors } from "../theme/theme";

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
  onCardsUpdated,
}) {
  const [addCardOpen, setAddCardOpen] = useState(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCardCreated = (card) => {
    onCardsUpdated?.();
    setForm((prev) => ({ ...prev, cardId: card._id }));
  };

  const footer = (
    <>
      <Button flex={1} variant="outline" onClick={onClose} borderColor={appColors.border}>
        Cancel
      </Button>
      <Button
        flex={1}
        colorPalette="teal"
        bg={appColors.sage}
        color="white"
        _hover={{ bg: appColors.sageLight }}
        onClick={onSubmit}
        disabled={!form.cardId || !form.merchant || !form.amount}
      >
        {editMode ? "Save changes" : "Add expense"}
      </Button>
    </>
  );

  return (
    <>
      <AppModal
        open={open}
        onClose={onClose}
        title={editMode ? "Edit expense" : "Add expense"}
        subtitle={editMode ? "Update transaction details" : "Record a new family expense"}
        footer={footer}
      >
        <Stack gap={5}>
          <FormInput
            label="Merchant"
            name="merchant"
            value={form.merchant}
            onChange={handleChange}
            placeholder="e.g. Swiggy, Amazon"
            required
          />

          <Flex gap={4} direction={{ base: "column", sm: "row" }}>
            <Box flex={1}>
              <FormInput
                label="Amount (₹)"
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleChange}
                min={0}
                step="0.01"
                required
              />
            </Box>
            <Box flex={1}>
              <FormSelect label="Category" name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </FormSelect>
            </Box>
          </Flex>

          <Flex gap={4} direction={{ base: "column", sm: "row" }} align={{ sm: "flex-end" }}>
            <Box flex={1}>
              <FormSelect
                label="Card"
                name="cardId"
                value={form.cardId}
                onChange={handleChange}
                required
                placeholder="Select a card"
              >
                {cards.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.nickname} (•••• {c.lastFourDigits})
                  </option>
                ))}
              </FormSelect>
              {cards.length === 0 && (
                <Alert.Root status="info" mt={3} borderRadius="12px">
                  <Alert.Indicator />
                  <Alert.Title fontSize="sm">No cards yet. Tap &quot;New card&quot; to add one.</Alert.Title>
                </Alert.Root>
              )}
            </Box>
            <Button
              variant="outline"
              borderColor={appColors.sageLight}
              color={appColors.sage}
              h="52px"
              onClick={() => setAddCardOpen(true)}
              flexShrink={0}
            >
              <HiPlus /> New card
            </Button>
          </Flex>

          <SplitAllocationFields form={form} setForm={setForm} members={members} />

          <FormInput
            label="Date & time"
            name="expenseDate"
            type="datetime-local"
            value={form.expenseDate}
            onChange={handleChange}
          />

          <FormTextarea
            label="Notes (optional)"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
          />
        </Stack>
      </AppModal>

      <AddCardModal open={addCardOpen} onClose={() => setAddCardOpen(false)} onCreated={handleCardCreated} />
    </>
  );
}
