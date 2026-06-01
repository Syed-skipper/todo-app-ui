"use client";

import { Box, Button, Checkbox, IconButton, Text, Flex } from "@chakra-ui/react";
import { HiPlus, HiTrash } from "react-icons/hi2";
import { FormInput, FormSelect } from "./ui/form";
import { appColors } from "../theme/theme";

export default function SplitAllocationFields({ form, setForm, members }) {
  const splitType = form.splitType || "single";
  const amount = parseFloat(form.amount) || 0;

  const setSplitType = (v) => {
    setForm((f) => ({
      ...f,
      splitType: v,
      memberIds: v === "equal" ? f.memberIds || [] : [],
      customAllocations:
        v === "percent" || v === "custom"
          ? f.customAllocations?.length
            ? f.customAllocations
            : [{ familyMemberId: "", percent: "", amount: "" }]
          : [],
    }));
  };

  const toggleMember = (id) => {
    setForm((f) => {
      const ids = f.memberIds || [];
      return {
        ...f,
        memberIds: ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
      };
    });
  };

  const updateRow = (idx, field, value) => {
    setForm((f) => {
      const rows = [...(f.customAllocations || [])];
      rows[idx] = { ...rows[idx], [field]: value };
      return { ...f, customAllocations: rows };
    });
  };

  const addRow = () => {
    setForm((f) => ({
      ...f,
      customAllocations: [
        ...(f.customAllocations || []),
        { familyMemberId: "", percent: "", amount: "" },
      ],
    }));
  };

  const removeRow = (idx) => {
    setForm((f) => ({
      ...f,
      customAllocations: (f.customAllocations || []).filter((_, i) => i !== idx),
    }));
  };

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <FormSelect
        label="Allocation"
        name="splitType"
        value={splitType}
        onChange={(e) => setSplitType(e.target.value)}
      >
        <option value="single">Single person</option>
        <option value="equal">Equal split</option>
        <option value="percent">Percentage split</option>
        <option value="custom">Custom amounts</option>
      </FormSelect>

      {splitType === "single" && (
        <FormSelect
          label="Family member"
          name="familyMemberId"
          value={form.familyMemberId || ""}
          onChange={(e) => setForm({ ...form, familyMemberId: e.target.value })}
          required
          placeholder="Who spent?"
        >
          {members.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name}
              {m.relationship ? ` (${m.relationship})` : ""}
            </option>
          ))}
        </FormSelect>
      )}

      {splitType === "equal" && (
        <Box>
          <Text fontSize="sm" color={appColors.inkMuted} mb={2}>
            Select members to split ₹{amount.toLocaleString("en-IN")} equally
          </Text>
          {members.map((m) => (
            <Checkbox.Root
              key={m._id}
              checked={(form.memberIds || []).includes(m._id)}
              onCheckedChange={() => toggleMember(m._id)}
              mb={2}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control colorPalette="teal" />
              <Checkbox.Label ml={2}>{m.name}</Checkbox.Label>
            </Checkbox.Root>
          ))}
        </Box>
      )}

      {(splitType === "percent" || splitType === "custom") &&
        (form.customAllocations || []).map((row, idx) => (
          <Flex key={idx} gap={2} align="flex-start">
            <Box flex={1}>
              <FormSelect
                label="Member"
                value={row.familyMemberId || ""}
                onChange={(e) => updateRow(idx, "familyMemberId", e.target.value)}
                placeholder="Select"
              >
                {members.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </FormSelect>
            </Box>
            {splitType === "percent" ? (
              <FormInput
                label="%"
                type="number"
                value={row.percent}
                onChange={(e) => updateRow(idx, "percent", e.target.value)}
                min={0}
                max={100}
                width="100px"
              />
            ) : (
              <FormInput
                label="₹"
                type="number"
                value={row.amount}
                onChange={(e) => updateRow(idx, "amount", e.target.value)}
                min={0}
                step="0.01"
                width="120px"
              />
            )}
            <IconButton
              size="sm"
              variant="ghost"
              mt={8}
              onClick={() => removeRow(idx)}
              disabled={(form.customAllocations || []).length <= 1}
              aria-label="Remove row"
            >
              <HiTrash />
            </IconButton>
          </Flex>
        ))}

      {(splitType === "percent" || splitType === "custom") && (
        <Button size="sm" variant="ghost" onClick={addRow} color={appColors.sage}>
          <HiPlus /> Add row
        </Button>
      )}
    </Box>
  );
}
