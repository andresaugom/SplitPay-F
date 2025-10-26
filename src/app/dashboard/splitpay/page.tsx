'use client';

import React, { useState } from "react";
import { Box, Button, Typography, Stack, IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SpContacts, { Customer } from "@/components/dashboard/splitpay/sp-contacts";
import SPAmount from "@/components/dashboard/splitpay/sp-amount";
import SPSplitTable, { Contact } from "@/components/dashboard/splitpay/sp-distribution";

// Mock contacts data (igual al original)
const MOCK_CUSTOMERS: Customer[] = [
  { id: "1", name: "Ana", avatar: "", createdAt: new Date()},
  { id: "2", name: "Luis", avatar: "", createdAt: new Date()},
  { id: "3", name: "Andrés", avatar: "", createdAt: new Date()}
];

const SplitPaymentDemo: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedContacts, setSelectedContacts] = useState<Customer[]>([]);
  const [total, setTotal] = useState<number | null>(null);

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
    <Box sx={{ maxWidth: '400px', mx: "auto", p: 2 }}> {/* <-- Layout más estrecho */}

      {/* Flecha de "Atrás" y espaciador */}
      <Box sx={{ minHeight: 48, display: 'flex', alignItems: 'center' }}> {/* Contenedor para estabilidad */}
        {step > 1 && (
          <IconButton onClick={handleBack} sx={{ mb: 2 }}>
            <ArrowBackIcon />
          </IconButton>
        )}
      </Box>
      
      {/* Indicador de Pasos Circular */}
      <Stack direction="row" justifyContent="center" spacing={2} sx={{ mb: 4 }}>
        {[1, 2, 3].map((s) => (
          <Box
            key={s}
            sx={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              bgcolor: s === step ? 'primary.main' : 'grey.300',
              color: s === step ? 'common.white' : 'grey.600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
            }}
          >
            {s}
          </Box>
        ))}
      </Stack>

      {/* Contenido del Paso */}
      {step === 1 && (
        <SpContacts
          rows={MOCK_CUSTOMERS}
          onSelectionChange={(sel) => setSelectedContacts(sel)}
          onContinue={handleNext} // <-- Prop 'onContinue' añadido
        />
      )}

      {step === 2 && (
        <>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main', textAlign: 'center' }}>
            Total Amount
          </Typography>
          <SPAmount
            value={total}
            onChange={(val) => setTotal(val)}
            label="Total Amount to Split"
          />
        </>
      )}

      {step === 3 && (
        <>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main', textAlign: 'center' }}>
            Split Details
          </Typography>
          <SPSplitTable
            contacts={selectedContacts.map(c => ({ id: c.id, name: c.name }))}
            total={total ?? 0}
          />
        </>
      )}

      {/* Botones de Navegación (Solo para pasos 2 y 3) */}
      <Box mt={4}>
        {step === 2 && (
          <Button
            onClick={handleNext}
            variant="contained"
            disabled={!canProceedStep2}
            fullWidth // <-- Estilo añadido
            sx={{ p: 1.5, borderRadius: 2, fontSize: '1.1rem' }} // <-- Estilo añadido
          >
            Continuar
          </Button>
        )}
        {step === 3 && (
          <Button
            variant="contained"
            color="success"
            onClick={() => alert("Payment Confirmed!")}
            fullWidth // <-- Estilo añadido
            sx={{ p: 1.5, borderRadius: 2, fontSize: '1.1rem' }} // <-- Estilo añadido
          >
            Confirmar Pago
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default SplitPaymentDemo;