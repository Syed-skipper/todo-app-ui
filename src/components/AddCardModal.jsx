"use client";

import { useState } from "react";
import { Box, Button, Stack, Flex, Alert } from "@chakra-ui/react";
import AppModal from "./ui/AppModal";
import { FormInput, FormTextarea } from "./ui/form";
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
  notes: "",
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
        notes: form.notes?.trim() || undefined,
      };
      const res = await cardsApi.create(payload);
      invalidateCache("cards");
      onCreated?.(res.data.data);
      handleClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (err.response?.status === 403
            ? "Only admin can add cards. Ask your family admin."
            : "Could not add card. Check all fields.")
      );
    } finally {
      setSaving(false);
    }
  };

  const footer = (
    <>
      <Button flex={1} variant="outline" onClick={handleClose} disabled={saving} borderColor={appColors.border}>
        Cancel
      </Button>
      <Button
        flex={1}
        bg={appColors.sage}
        color="white"
        _hover={{ bg: appColors.sageLight }}
        onClick={handleSubmit}
        disabled={saving}
        loading={saving}
      >
        {saving ? "Saving…" : "Add card"}
      </Button>
    </>
  );

  return (
    <AppModal
      open={open}
      onClose={handleClose}
      title="Add credit card"
      subtitle="Register a family card for expense tracking"
      footer={footer}
      maxW="520px"
    >
      <Stack gap={5}>
        {error && (
          <Alert.Root status="error" borderRadius="12px">
            <Alert.Indicator />
            <Alert.Title>{error}</Alert.Title>
          </Alert.Root>
        )}
        <FormInput label="Card nickname" name="nickname" value={form.nickname} onChange={handleChange} placeholder="e.g. HDFC Primary" required />
        <FormInput label="Bank name" name="bankName" value={form.bankName} onChange={handleChange} placeholder="e.g. HDFC" required />
        <Flex gap={4} direction={{ base: "column", sm: "row" }}>
          <Box flex={1}>
            <FormInput label="Last 4 digits" name="lastFourDigits" value={form.lastFourDigits} onChange={handleChange} maxLength={4} required />
          </Box>
          <Box flex={1}>
            <FormInput label="Credit limit (₹)" name="creditLimit" type="number" value={form.creditLimit} onChange={handleChange} required />
          </Box>
        </Flex>
        <Flex gap={4} direction={{ base: "column", sm: "row" }}>
          <Box flex={1}>
            <FormInput label="Billing cycle start (day)" name="billingCycleStart" type="number" value={form.billingCycleStart} onChange={handleChange} min={1} max={31} required />
          </Box>
          <Box flex={1}>
            <FormInput label="Billing cycle end (day)" name="billingCycleEnd" type="number" value={form.billingCycleEnd} onChange={handleChange} min={1} max={31} required />
          </Box>
        </Flex>
        <FormInput label="Payment due day" name="dueDate" type="number" value={form.dueDate} onChange={handleChange} min={1} max={31} required />
        <FormTextarea label="Notes (optional)" name="notes" value={form.notes} onChange={handleChange} rows={2} />
      </Stack>
    </AppModal>
  );
}
