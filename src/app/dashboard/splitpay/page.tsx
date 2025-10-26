'use client';

import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Stack, CircularProgress, Alert } from "@mui/material";
import SpContacts from "@/components/dashboard/splitpay/sp-contacts";
import SPAmount from "@/components/dashboard/splitpay/sp-amount";
import SPSplitTable, { Contact } from "@/components/dashboard/splitpay/sp-distribution";

const api = process.env.NEXT_PUBLIC_API_URL;

const SplitPaymentDemo: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [total, setTotal] = useState<number | null>(null);

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch contacts al cargar el componente
  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${api}/contacts`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error(`Server responded with ${res.status}`);
        }

        const data: Contact[] = await res.json();
        setContacts(data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching contacts:", err);
        setError("Could not load contacts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const canProceedStep1 = selectedContacts.length > 0;
  const canProceedStep2 = total !== null && total > 0;

  const handleNext = () => {
    if (step === 1 && canProceedStep1) setStep(2);
    else if (step === 2 && canProceedStep2) setStep(3);
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      <Typography variant="h5" mb={3}>
        Split Payment Demo
      </Typography>

      {/* Step Indicator */}
      <Stack direction="row" spacing={2} mb={3}>
        <Typography color={step === 1 ? "primary" : "text.secondary"}>1. Select Contacts</Typography>
        <Typography color={step === 2 ? "primary" : "text.secondary"}>2. Enter Total</Typography>
        <Typography color={step === 3 ? "primary" : "text.secondary"}>3. Split Payment</Typography>
      </Stack>

      {/* Estado de carga / error */}
      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Step Content */}
      {!loading && !error && (
        <>
          {step === 1 && (
            <SpContacts
              rows={contacts}
              onSelectionChange={(sel) => setSelectedContacts(sel)}
            />
          )}

          {step === 2 && (
            <SPAmount
              value={total}
              onChange={(val) => setTotal(val)}
              label="Total Amount to Split"
            />
          )}

          {step === 3 && (
            <>
              <SPSplitTable
                contacts={selectedContacts.map(c => ({ id: c.id, name: c.name }))}
                total={total ?? 0}
              />
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary">
                  Review the allocations above before confirming.
                </Typography>
              </Box>
            </>
          )}
        </>
      )}

      {/* Navigation Buttons */}
      <Box mt={4} display="flex" justifyContent="space-between">
        <Button disabled={step === 1} onClick={handleBack} variant="outlined">
          Back
        </Button>
        {step < 3 && (
          <Button
            onClick={handleNext}
            variant="contained"
            disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
          >
            Next
          </Button>
        )}
        {step === 3 && (
          <Button
            variant="contained"
            color="success"
            onClick={() => alert("Payment Confirmed!")}
          >
            Confirm
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default SplitPaymentDemo;