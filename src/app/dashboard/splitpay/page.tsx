'use client';

import React, { useState } from "react";
import { Box, Button, Typography, Stack } from "@mui/material";
import SpContacts, { Customer } from "@/components/dashboard/splitpay/sp-contacts";
import SPAmount from "@/components/dashboard/splitpay/sp-amount";
import SPSplitTable, { Contact } from "@/components/dashboard/splitpay/sp-distribution";

// Mock contacts data (¡Corregí el último ID que estaba vacío!)
const MOCK_CUSTOMERS: Customer[] = [
  { id: "1", name: "Jaime", avatar: "", createdAt: new Date()},
  { id: "2", name: "Lalo", avatar: "", createdAt: new Date()},
  { id: "3", name: "Shira", avatar: "", createdAt: new Date()},
  { id: "4", name: "Andrés Gómez", avatar: "", createdAt: new Date()},
  { id: "5", name: "Heidy Ochoa", avatar: "", createdAt: new Date()},
  { id: "6", name: "Isaac Chávez", avatar: "", createdAt: new Date()},
  { id: "7", name: "Jóse de la Madrid", avatar: "", createdAt: new Date()} // <--- ID CORREGIDO
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

    <Box sx={{ maxWidth: 400, mx: "auto", p: 2 }}> 
<Typography 
  variant="h5" 
  mb={3}
  sx={{
    textAlign: 'center',      // Centra el texto
    color: 'primary.main',    // Le da el color azul primario de tu tema
    fontWeight: 900,          // Fuente muy gruesa (como en la imagen)
  }}
> 
  {/* --- CAMBIO AQUÍ --- */}
  {step === 1 ? "Splitters" : (step === 2 ? "SplitInfo" : "Split Details")}
</Typography>

      {/* --- INICIO DEL INDICADOR DE PASOS CORREGIDO --- */}
      <Stack 
        direction="row" 
        alignItems="center" // Centra verticalmente los círculos y las líneas
        justifyContent="center" // Centra todo el bloque
        mb={3} 
      >
        {[1, 2, 3].map((s, index) => (
          // Usamos React.Fragment para poder añadir la línea antes de cada círculo (excepto el primero)
          <React.Fragment key={s}>
            {/* Añade una línea ANTES del círculo, si no es el primero (index > 0) */}
            {index > 0 && (
              <Box sx={{
                width: { xs: 30, sm: 50 }, // Ancho de la línea
                height: 2,
                bgcolor: 'grey.300', // Color de la línea
              }} />
            )}
            
            {/* El Círculo */}
            <Box sx={{
              width: 30,
              height: 30,
              borderRadius: '50%', // Esto lo hace un círculo
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              transition: 'all 0.3s ease', // Transición suave
              
              // --- Lógica de color ---
              // Si el paso (s) es el paso actual (step), píntalo de azul
              bgcolor: step === s ? 'primary.main' : 'grey.300',
              // Si el paso (s) es el paso actual (step), pinta el texto de blanco
              color: step === s ? 'common.white' : 'grey.600',
            }}>
              {s}
            </Box>
          </React.Fragment>
        ))}
      </Stack>
      {/* --- FIN DEL INDICADOR DE PASOS CORREGIDO --- */}

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
          label="Monto:"
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
          <Button variant="contained" color="success" onClick={() => alert("Payment Confirmed!")}>
            Confirm
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default SplitPaymentDemo;