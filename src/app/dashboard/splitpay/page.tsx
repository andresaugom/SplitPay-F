'use client';

import React, { useState } from "react";
import { Box, Button, Typography, Stack, CardMedia } from "@mui/material";
import SpContacts, { Customer } from "@/components/dashboard/splitpay/sp-contacts";
import SPAmount from "@/components/dashboard/splitpay/sp-amount";
import SPSplitTable, { Contact } from "@/components/dashboard/splitpay/sp-distribution";

// Mock contacts data (¡Corregí el último ID que estaba vacío!)
const MOCK_CUSTOMERS: Customer[] = [
  { id: "1", name: "Jaime", avatar: "", createdAt: new Date() },
  { id: "2", name: "Lalo", avatar: "", createdAt: new Date() },
  { id: "3", name: "Shira", avatar: "", createdAt: new Date() },
  { id: "4", name: "Andrés Gómez", avatar: "", createdAt: new Date() },
  { id: "5", name: "Heidy Ochoa", avatar: "", createdAt: new Date() },
  { id: "6", name: "Isaac Chávez", avatar: "", createdAt: new Date() },
  { id: "7", name: "Jóse de la Madrid", avatar: "", createdAt: new Date() },
];

const SplitPaymentDemo: React.FC = () => {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0); // Agregamos el paso 0 para la pantalla inicial
  const [selectedContacts, setSelectedContacts] = useState<Customer[]>([]);
  const [total, setTotal] = useState<number | null>(null);

  const canProceedStep1 = selectedContacts.length > 0;
  const canProceedStep2 = total !== null && total > 0;

  const handleNext = () => {
    if (step === 0) setStep(1); // Desde la pantalla inicial al paso 1
    else if (step === 1 && canProceedStep1) setStep(2);
    else if (step === 2 && canProceedStep2) setStep(3);
  };

  const handleBack = () => {
    if (step === 1) setStep(0); // Volver a la pantalla inicial desde el paso 1
    else if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", p: 2 }}>
      {step === 0 ? (
        // Pantalla inicial con logo y botón
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
          }}
        >
          {/* Logo de la empresa */}
          <CardMedia
            component="img"
            image="/public/assets/splitpay-icon.png" // Reemplaza con la ruta real de tu logo
            alt="Company Logo"
            sx={{ width: 200, mb: 4 }} // Ajusta el tamaño según necesites
          />
          {/* Botón de inicio */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            sx={{ px: 4, py: 1.5 }}
          >
            Iniciar
          </Button>
        </Box>
      ) : (
        <>
          <Typography variant="h5" mb={3}>
            Split Payment Demo
          </Typography>

          {/* Step Indicator */}
          <Stack direction="row" spacing={2} mb={3}>
            <Typography color={step === 1 ? "primary" : "text.secondary"}>
              1. Select Contacts
            </Typography>
            <Typography color={step === 2 ? "primary" : "text.secondary"}>
              2. Enter Total
            </Typography>
            <Typography color={step === 3 ? "primary" : "text.secondary"}>
              3. Split Payment
            </Typography>
          </Stack>

          {/* Step Content */}
          {step === 1 && (
            <SpContacts
              rows={MOCK_CUSTOMERS}
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
                contacts={selectedContacts.map((c) => ({ id: c.id, name: c.name }))}
                total={total ?? 0}
              />
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary">
                  Review the allocations above before confirming.
                </Typography>
              </Box>
            </>
          )}

          {/* Navigation Buttons */}
          <Box mt={4} display="flex" justifyContent="space-between">
            <Button disabled={step === 0} onClick={handleBack} variant="outlined">
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
        </>
      )}
    </Box>
  );
};

export default SplitPaymentDemo;