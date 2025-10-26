'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Box, Button, Typography, Stack, useTheme, useMediaQuery, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SpContacts, { Customer } from '@/components/dashboard/splitpay/sp-contacts';
import SPAmount from '@/components/dashboard/splitpay/sp-amount';
import SPSplitTable from '@/components/dashboard/splitpay/sp-distribution';

// Mock contacts data with stricter typing
const MOCK_CUSTOMERS: Customer[] = [
  { id: '1', name: 'Ana', email: 'ana@mail.com', phone: '123', avatar: '', createdAt: new Date() },
  { id: '2', name: 'Luis', email: 'luis@mail.com', phone: '456', avatar: '', createdAt: new Date() },
  { id: '3', name: 'Andrés', email: 'andres@mail.com', phone: '789', avatar: '', createdAt: new Date() },
];

// Define step type for better type safety
type Step = 1 | 2 | 3 | 4;

// 1 - Initial Screen
// 2 - Select Contacts
// 3 - Enter Total Amount
// 4 - Review & Confirm Split

const SplitPaymentDemo: React.FC = () => {
  const [step, setStep] = useState<Step>(1);
  const [selectedContacts, setSelectedContacts] = useState<Customer[]>([]);
  const [total, setTotal] = useState<number | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Memoize derived states to prevent unnecessary recalculations
  const canProceedStep1 = useMemo(() => selectedContacts.length > 0, [selectedContacts]);
  const canProceedStep2 = useMemo(() => total !== null && total > 0, [total]);

  // Use useCallback to prevent unnecessary re-renders of handler functions
  const handleNext = useCallback(() => {
    if (step === 1) setStep(2);
    else if (step === 2 && canProceedStep1) setStep(3);
    else if (step === 3 && canProceedStep2) setStep(4);
  }, [step, canProceedStep1, canProceedStep2]);

  const handleBack = useCallback(() => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
    else if (step === 4) setStep(3);
  }, [step]);

  const handleConfirm = useCallback(() => {
    alert('Payment Confirmed!');
  }, []);

  // Memoize step content to avoid re-rendering unchanged components
  const stepContent = useMemo(() => {
    switch (step) {
      case 2:
        return (
          <SpContacts
            rows={MOCK_CUSTOMERS}
            onSelectionChange={setSelectedContacts}
            aria-label="Select contacts for split payment"
          />
        );
      case 3:
        return (
          <SPAmount
            value={total}
            onChange={setTotal}
            label="Total Amount to Split"
            aria-label="Enter total amount to split"
          />
        );
      case 4:
        return (
          <>
            <SPSplitTable
              contacts={selectedContacts.map(({ id, name }) => ({ id, name }))}
              total={total ?? 0}
              aria-label="Review split payment allocations"
            />
            <Box mt={2}>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign={isMobile ? 'center' : 'left'}
              >
                Review the allocations before confirming.
              </Typography>
            </Box>
          </>
        );
      default:
        return null;
    }
  }, [step, selectedContacts, total, isMobile]);

  return (
    <Box // Boton Iniciar Split
      sx={{
        maxWidth: 600,
        mx: 'auto',
        p: { xs: 2, sm: 3, md: 4 },
        minHeight: '100vh',
        // ensure content doesn't get hidden by fixed action bar on mobile
        pb: { xs: '120px', sm: 0 },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      role="main"
      aria-labelledby="split-payment-title"
    >
  {/* Initial Screen */}
  {step === 1 && (
  <Box
    sx={{
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh', // Ensure full viewport height
      textAlign: 'center',
      px: { xs: 2, sm: 3 }, // Consistent padding
    }}
  >
    {/* center the logo exactly in the viewport */}
    <Box sx={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      <Box
        sx={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          px: 2,
        }}
      >
        <Box
          component="img"
          src="/assets/splitpay-icon.png"
          alt="Split Payment Logo"
          sx={{
            width: { xs: '85vw', sm: '70vw', md: '55vw' },
            maxWidth: '900px',
            height: 'auto',
            display: 'block',
          }}
        />
      </Box>

      {/* Fixed bottom start button stays visible */}
      <Button
        variant="contained"
        color="primary"
        size={isMobile ? 'medium' : 'large'}
        onClick={() => setStep(2)}
        sx={{
          position: 'fixed',
          bottom: { xs: 'calc(env(safe-area-inset-bottom, 0px) + 18px)', sm: 28 },
          left: '50%',
          transform: 'translateX(-50%)',
          width: { xs: '95%', sm: 480, md: 560 },
          maxWidth: 900,
          borderRadius: 2,
          py: { xs: 2.25, sm: 2.5 },
          fontSize: { xs: '1.05rem', sm: '1.1rem' },
          boxShadow: (theme) => theme.shadows[3],
          zIndex: (theme) => theme.zIndex.appBar + 1,
        }}
        aria-label="Start splitting expenses"
      >
        Iniciar Split
      </Button>
    </Box>
  </Box>
)}
  {/* Main Flow */}
      {step > 1 && (
        <Box sx={{ flexGrow: 1, position: 'relative', alignItems: "baseline" }}> 
          {/* Top-left back button (icon) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <IconButton
            onClick={handleBack}
            aria-label="Go back"
            sx={(theme) => ({
              zIndex: theme.zIndex.appBar + 2, // asegura que esté sobre otros elementos
            })}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            id="split-payment-title"
            variant={isMobile ? 'h6' : 'h5'}        
            textAlign="center"
            sx={{ fontWeight: 600 }}
          >
            Split Payment Demo
          </Typography>
          <IconButton
          style={{ visibility: 'hidden' }} // espacio reservado para mantener el título centrado
            onClick={handleBack}
            aria-label="Go back"
            sx={(theme) => ({
              zIndex: theme.zIndex.appBar + 2, // asegura que esté sobre otros elementos
            })}
          ></IconButton>
          </div>

          {/* Step Indicator */}
          <Stack
            direction={isMobile ? 'column' : 'row'}
            spacing={isMobile ? 1 : 2} // 
            alignItems={isMobile ? 'flex-start' : 'center'}
            mb={3}
            sx={{ textAlign: isMobile ? 'left' : 'center' }}
            role="navigation"
            aria-label="Split payment steps"
          >
            <Typography color={step === 2 ? 'primary' : 'text.secondary'}>2. Select Contacts</Typography>
            <Typography color={step === 3 ? 'primary' : 'text.secondary'}>3. Enter Total</Typography>
            <Typography color={step === 4 ? 'primary' : 'text.secondary'}>4. Review</Typography>
          </Stack>

          {/* Step Content */}
          {stepContent}

          {/* Navigation Buttons */}
          {/* On mobile we render a fixed bottom action bar to improve UX */}
          {!isMobile && (
            <Box
              mt={4}
              display="flex"
              flexDirection={isMobile ? 'column' : 'row'}
              justifyContent="flex-end"
              gap={2}
            >
              {step < 4 && (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  disabled={step === 2 ? !canProceedStep1 : !canProceedStep2}
                  fullWidth={isMobile}
                  aria-label="Proceed to next step"
                >
                  Continuar
                </Button>
              )}

              {step === 4 && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleConfirm}
                  fullWidth={isMobile}
                  aria-label="Confirm split payment"
                >
                  Confirm
                </Button>
              )}
            </Box>
          )}

          {isMobile && (
            <Box
              component="nav"
              aria-label="Mobile action bar"
              sx={(theme) => ({
                position: 'fixed',
                left: 0,
                right: 0,
                bottom: 0,
                px: 2,
                py: 'calc(env(safe-area-inset-bottom, 8px) + 12px)',
                background: theme.palette.background.paper,
                boxShadow: '0 -6px 18px rgba(13, 38, 59, 0.08)',
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                zIndex: theme.zIndex.appBar + 1,
              })}
            >
              {step < 4 && (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  disabled={step === 2 ? !canProceedStep1 : !canProceedStep2}
                  sx={{ flex: 1 }}
                  aria-label="Proceed to next step"
                >
                  Continuar
                </Button>
              )}

              {step === 4 && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleConfirm}
                  sx={{ flex: 1 }}
                  aria-label="Confirm split payment"
                >
                  Confirm
                </Button>
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default SplitPaymentDemo;