'use client';

import React, { useState } from "react";
import { Box, Button, Typography, Stack } from "@mui/material";
import SpContacts, { Customer } from "@/components/dashboard/splitpay/sp-contacts";
import SPAmount from "@/components/dashboard/splitpay/sp-amount";
import SPSplitTable, { Contact } from "@/components/dashboard/splitpay/sp-distribution";

// Mock contacts data
const MOCK_CUSTOMERS: Customer[] = [
  { id: "1", name: "Jaime", avatar: "", createdAt: new Date()},
  { id: "2", name: "Lalo", avatar: "", createdAt: new Date()},
  { id: "3", name: "Shira", avatar: "", createdAt: new Date()},
  { id: "4", name: "Andrés Gómez", avatar: "", createdAt: new Date()},
  { id: "5", name: "Heidy Ochoa", avatar: "", createdAt: new Date()},
  { id: "6", name: "Isaac Chávez", avatar: "", createdAt: new Date()},
  { id: "7", name: "Jóse de la Madrid", avatar: "", createdAt: new Date()}
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
    textAlign: 'center',
    color: 'primary.main',
    fontWeight: 900,
  }}
> 
  {step === 1 ? "Splitters" : (step === 2 ? "SplitInfo" : "SplitConfig")}
</Typography>

      {/* --- INDICADOR DE PASOS --- */}
      <Stack 
        direction="row" 
        alignItems="center"
        justifyContent="center"
        mb={3} 
      >
        {[1, 2, 3].map((s, index) => (
          <React.Fragment key={s}>
            {index > 0 && (
              <Box sx={{
                width: { xs: 30, sm: 50 },
                height: 2,
                bgcolor: 'grey.300',
              }} />
            )}
            
            <Box sx={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              bgcolor: step === s ? 'primary.main' : 'grey.300',
              color: step === s ? 'common.white' : 'grey.600',
            }}>
              {s}
            </Box>
          </React.Fragment>
        ))}
      </Stack>
      {/* --- FIN DEL INDICADOR DE PASOS --- */}

      {/* Step Content */}
      
      {/* --- INICIO DEL CAMBIO: 'height' aumentada para 5 filas --- */}
      {step === 1 && (
        <Box 
          sx={{ 
            // CAMBIO: Aumentado para mostrar ~5 filas
            height: 280, 
            overflowY: 'auto', 
            
            // Estilos para el contenedor
            border: '1px solid',
            borderColor: 'grey.200',
            borderRadius: 2,
            bgcolor: 'background.paper',
            
            // Estilos para la barra de scroll
            '&::-webkit-scrollbar': { width: '6px' },
            '&::-webkit-scrollbar-track': { background: '#f1f1f1' },
            '&::-webkit-scrollbar-thumb': { background: '#ccc', borderRadius: '3px' },
            '&::-webkit-scrollbar-thumb:hover': { background: '#aaa' }
          }}
        >
          <SpContacts
            rows={MOCK_CUSTOMERS}
            onSelectionChange={(sel) => setSelectedContacts(sel)}
          />
        </Box>
      )}
      {/* --- FIN DEL CAMBIO --- */}

      {step === 2 && (
        <Box>
          {/* CAMBIO: Aumento del tamaño de la palabra "Monto" */}
          <Typography variant="h6" component="div" fontWeight="bold" mb={1}>
            Monto:
          </Typography>
          <SPAmount
            value={total}
            onChange={(val) => setTotal(val)}
            // CAMBIO: Se elimina la prop 'label' ya que ahora se usa un <Typography>
            label=""
          />
        </Box>
      )}

      {step === 3 && (
        <SPSplitTable
          contacts={selectedContacts.map(c => ({ id: c.id, name: c.name }))}
          total={total ?? 0}
        />
      )}


      {/* Navigation Buttons */}
      <Box mt={4} display="flex" justifyContent={step === 1 ? 'flex-end' : 'space-between'}>
        {step > 1 && (
          <Button onClick={handleBack} variant="outlined">
            Regresar
          </Button>
        )}

        {step < 3 && (
          <Button
            onClick={handleNext}
            variant="contained"
            disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
          >
            Continuar
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default SplitPaymentDemo;