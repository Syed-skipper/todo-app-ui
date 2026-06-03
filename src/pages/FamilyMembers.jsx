import { useEffect, useState } from "react";
import { Box, Button, Text, IconButton, Stack, Flex } from "@chakra-ui/react";
import { HiPlus, HiPencil, HiTrash } from "react-icons/hi2";
import PageHeader from "../components/PageHeader";
import PageLoading from "../components/ui/PageLoading";
import AppModal from "../components/ui/AppModal";
import { FormInput, FormTextarea } from "../components/ui/form";
import { familyMembersApi } from "../lib/api";
import { invalidateCache } from "../lib/simpleCache";
import { fetchFamilyMembers } from "../lib/referenceData";
import { appColors } from "../theme/theme";

const empty = { name: "", relationship: "", phone: "", notes: "" };

export default function FamilyMembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);

  const load = () => {
    setLoading(true);
    invalidateCache("familyMembers");
    fetchFamilyMembers()
      .then(setMembers)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    if (editId) await familyMembersApi.update(editId, form);
    else await familyMembersApi.create(form);
    setOpen(false);
    setForm(empty);
    setEditId(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this family member?")) return;
    await familyMembersApi.remove(id);
    load();
  };

  const footer = (
    <>
      <Button flex={1} variant="outline" onClick={() => setOpen(false)} borderColor={appColors.border}>Cancel</Button>
      <Button flex={1} bg={appColors.sage} color="white" onClick={handleSave} disabled={!form.name.trim()}>Save</Button>
    </>
  );

  return (
    <>
      <PageHeader title="Family members" subtitle="Profiles for expense allocation — no separate login" />
      <Box mb={6} display="flex" justifyContent="flex-end">
        <Button bg={appColors.sage} color="white" onClick={() => { setEditId(null); setForm(empty); setOpen(true); }}>
          <HiPlus /> Add member
        </Button>
      </Box>

      {loading ? (
        <PageLoading />
      ) : (
        <Stack gap={3}>
          {members.map((m) => (
            <Flex
              key={m._id}
              p={4}
              bg={appColors.paper}
              borderRadius="12px"
              border="1px solid"
              borderColor={appColors.border}
              justify="space-between"
              align="center"
              flexWrap="wrap"
              gap={3}
            >
              <Box>
                <Text fontWeight={600}>{m.name}</Text>
                <Text fontSize="sm" color={appColors.inkMuted}>
                  {[m.relationship, m.phone].filter(Boolean).join(" · ") || "—"}
                </Text>
                {m.notes && <Text fontSize="xs" color={appColors.inkMuted} mt={1}>{m.notes}</Text>}
              </Box>
              <Box>
                <IconButton variant="ghost" size="sm" onClick={() => { setEditId(m._id); setForm({ name: m.name, relationship: m.relationship || "", phone: m.phone || "", notes: m.notes || "" }); setOpen(true); }} aria-label="Edit">
                  <HiPencil />
                </IconButton>
                <IconButton variant="ghost" size="sm" onClick={() => handleDelete(m._id)} aria-label="Delete">
                  <HiTrash />
                </IconButton>
              </Box>
            </Flex>
          ))}
          {members.length === 0 && (
            <Text color={appColors.inkMuted} textAlign="center" py={10}>
              Add family members to assign expenses and track settlements.
            </Text>
          )}
        </Stack>
      )}

      <AppModal open={open} onClose={() => setOpen(false)} title={editId ? "Edit member" : "Add family member"} footer={footer} maxW="400px">
        <Stack gap={4}>
          <FormInput label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <FormInput label="Relationship" value={form.relationship} onChange={(e) => setForm({ ...form, relationship: e.target.value })} placeholder="e.g. Brother, Mother" />
          <FormInput label="Phone (WhatsApp)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <FormTextarea label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
        </Stack>
      </AppModal>
    </>
  );
}
