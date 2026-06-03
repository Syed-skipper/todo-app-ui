import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Text,
  IconButton,
  Flex,
  Stack,
  Alert,
} from "@chakra-ui/react";
import { HiClipboardDocument, HiCreditCard } from "react-icons/hi2";
import PageHeader from "../components/PageHeader";
import SoftCard from "../components/ui/SoftCard";
import PageLoading from "../components/ui/PageLoading";
import AppModal from "../components/ui/AppModal";
import { FormInput, FormSelect } from "../components/ui/form";
import { settlementsApi, memberPaymentsApi } from "../lib/api";
import { fetchFamilyMembers } from "../lib/referenceData";
import { appColors } from "../theme/theme";

const METHODS = [
  { value: "upi", label: "UPI" },
  { value: "bank_transfer", label: "Bank transfer" },
  { value: "cash", label: "Cash" },
  { value: "other", label: "Other" },
];

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function SettlementsPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [data, setData] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payOpen, setPayOpen] = useState(false);
  const [waText, setWaText] = useState("");
  const [waOpen, setWaOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [payForm, setPayForm] = useState({
    familyMember: "",
    amount: "",
    paymentDate: new Date().toISOString().slice(0, 10),
    method: "upi",
    notes: "",
  });

  const load = async () => {
    setLoading(true);
    try {
      const [balRes, mems] = await Promise.all([
        settlementsApi.balances({ month, year }),
        fetchFamilyMembers(),
      ]);
      setData(balRes.data.data);
      setMembers(mems);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [month, year]);

  const format = (n) => `₹${(n || 0).toLocaleString("en-IN")}`;
  const years = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1];

  const openWhatsApp = async (memberId) => {
    const res = await settlementsApi.whatsapp(memberId, { month, year });
    const { message, waLink } = res.data.data;
    setWaText(message);
    setWaOpen(true);
    if (waLink) window.open(waLink, "_blank");
  };

  const copyWa = () => {
    navigator.clipboard.writeText(waText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const recordPayment = async () => {
    await memberPaymentsApi.create({
      ...payForm,
      amount: parseFloat(payForm.amount),
      billingMonth: month,
      billingYear: year,
    });
    setPayOpen(false);
    setPayForm({
      familyMember: "",
      amount: "",
      paymentDate: new Date().toISOString().slice(0, 10),
      method: "upi",
      notes: "",
    });
    load();
  };

  const payFooter = (
    <>
      <Button flex={1} variant="outline" onClick={() => setPayOpen(false)} borderColor={appColors.border}>Cancel</Button>
      <Button flex={1} bg={appColors.sage} color="white" onClick={recordPayment} disabled={!payForm.familyMember || !payForm.amount}>Save</Button>
    </>
  );

  const waFooter = (
    <>
      <Button flex={1} variant="outline" onClick={() => setWaOpen(false)} borderColor={appColors.border}>Close</Button>
      <Button flex={1} bg={appColors.sage} color="white" onClick={copyWa}>{copied ? "Copied!" : "Copy"}</Button>
    </>
  );

  return (
    <>
      <PageHeader title="Settlements" subtitle="Outstanding balances and repayments from family" />

      <Flex gap={3} mb={6} flexWrap="wrap" align="flex-end">
        <Box minW="100px">
          <FormSelect label="Month" value={month} onChange={(e) => setMonth(+e.target.value)}>
            {monthNames.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </FormSelect>
        </Box>
        <Box minW="100px">
          <FormSelect label="Year" value={year} onChange={(e) => setYear(+e.target.value)}>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </FormSelect>
        </Box>
        <Button bg={appColors.sage} color="white" onClick={() => setPayOpen(true)}>
          <HiCreditCard /> Record payment
        </Button>
      </Flex>

      {loading ? (
        <PageLoading />
      ) : (
        <>
          {data?.unallocated?.count > 0 && (
            <Alert.Root status="warning" mb={4} borderRadius="12px">
              <Alert.Indicator />
              <Alert.Title>
                {data.unallocated.count} unassigned transaction(s) totaling {format(data.unallocated.unallocatedAmount)}
              </Alert.Title>
            </Alert.Root>
          )}

          <SoftCard title="Outstanding by member" subtitle={`${monthNames[month - 1]} ${year}`}>
            {(data?.balances || []).map((b) => (
              <Flex
                key={b.familyMember._id}
                justify="space-between"
                align="center"
                flexWrap="wrap"
                gap={2}
                py={3}
                borderBottom="1px solid"
                borderColor={appColors.border}
                _last={{ borderBottom: "none" }}
              >
                <Box>
                  <Text fontWeight={600}>{b.familyMember.name}</Text>
                  <Text fontSize="xs" color={appColors.inkMuted}>
                    Assigned {format(b.totalAssigned)} · Paid {format(b.totalPaid)}
                  </Text>
                </Box>
                <Flex align="center" gap={2}>
                  <Text fontWeight={700} color={b.outstanding > 0 ? appColors.error : appColors.success}>
                    {format(b.outstanding)}
                  </Text>
                  <Button size="sm" variant="outline" borderColor={appColors.border} onClick={() => openWhatsApp(b.familyMember._id)}>
                    WhatsApp
                  </Button>
                </Flex>
              </Flex>
            ))}
          </SoftCard>
        </>
      )}

      <AppModal open={payOpen} onClose={() => setPayOpen(false)} title="Record repayment" footer={payFooter} maxW="400px">
        <Stack gap={4}>
          <FormSelect label="From" value={payForm.familyMember} onChange={(e) => setPayForm({ ...payForm, familyMember: e.target.value })} placeholder="Select member">
            {members.map((m) => (
              <option key={m._id} value={m._id}>{m.name}</option>
            ))}
          </FormSelect>
          <FormInput label="Amount (₹)" type="number" value={payForm.amount} onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })} />
          <FormInput label="Date" type="date" value={payForm.paymentDate} onChange={(e) => setPayForm({ ...payForm, paymentDate: e.target.value })} />
          <FormSelect label="Method" value={payForm.method} onChange={(e) => setPayForm({ ...payForm, method: e.target.value })}>
            {METHODS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </FormSelect>
          <FormInput label="Notes" value={payForm.notes} onChange={(e) => setPayForm({ ...payForm, notes: e.target.value })} />
        </Stack>
      </AppModal>

      <AppModal
        open={waOpen}
        onClose={() => setWaOpen(false)}
        title="WhatsApp message"
        footer={waFooter}
        maxW="520px"
      >
        <Box position="relative">
          <IconButton position="absolute" right={0} top={-8} variant="ghost" size="sm" onClick={copyWa} aria-label="Copy">
            <HiClipboardDocument />
          </IconButton>
          <Text as="pre" whiteSpace="pre-wrap" fontFamily="inherit" fontSize="sm">
            {waText}
          </Text>
        </Box>
      </AppModal>
    </>
  );
}
