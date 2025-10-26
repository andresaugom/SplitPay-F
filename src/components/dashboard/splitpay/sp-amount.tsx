'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
} from '@mui/material';

// --- Props ---
interface SPAmountProps {
  value: number | null;
  onChange: (value: number | null) => void;
  label: string;
}

// --- Función Helper para formatear Moneda ---
const formatCurrency = (amount: number | null) => {
  if (amount === null || isNaN(amount) || amount === 0) {
    return '$0.00';
  }
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
};

// --- Componente SPAmount ---
const SPAmount: React.FC<SPAmountProps> = ({ value, onChange, label }) => {
  const [baseAmount, setBaseAmount] = useState<string>('');
  const [tipPercent, setTipPercent] = useState<string | null>(null);
  const [customTip, setCustomTip] = useState<string>('');

  useEffect(() => {
    const parsedBase = parseFloat(baseAmount);

    if (isNaN(parsedBase) || parsedBase <= 0) {
      onChange(null);
      return;
    }

    let percent = 0;
    if (tipPercent === 'custom') {
      percent = parseFloat(customTip);
    } else if (tipPercent) {
      percent = parseFloat(tipPercent);
    }

    if (isNaN(percent) || percent < 0) {
      percent = 0;
    }

    const tipAmount = parsedBase * (percent / 100);
    const newTotal = parsedBase + tipAmount;

    onChange(newTotal);
  }, [baseAmount, tipPercent, customTip, onChange]);

  const handleTipChange = (
    event: React.MouseEvent<HTMLElement>,
    newTip: string | null
  ) => {
    setTipPercent(newTip);
  };

  const handleCustomTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomTip(e.target.value);
    setTipPercent('custom');
  };

  return (
    <Stack spacing={2}>
      {/* === CAJA DE MONTO === */}
      <Paper
        elevation={0}
        sx={{ bgcolor: 'grey.200', p: 2, borderRadius: 2 }}
      >
        <TextField
          label={label}
          value={baseAmount}
          onChange={(e) => setBaseAmount(e.target.value)}
          type="number"
          placeholder="0.00"
          fullWidth
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          sx={{ bgcolor: 'common.white' }}
        />
      </Paper>

      {/* === CAJA DE EXTRA (PROPINA) === */}
      <Paper
        elevation={0}
        sx={{ bgcolor: 'grey.200', p: 2, borderRadius: 2 }}
      >
        <Stack spacing={1.5}>
          {/* --- CAMBIO AQUÍ --- */}
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'grey.700' }}>
            Extra:
          </Typography>
          
          <ToggleButtonGroup
            value={tipPercent}
            exclusive
            onChange={handleTipChange}
            fullWidth
            aria-label="tip percentage"
            sx={{
              // Targeta a cualquier hijo ToggleButton que esté seleccionado
              '& .MuiToggleButton-root.Mui-selected': {
                bgcolor: '#D32F2F', // Color rojo
                color: 'common.white', // Texto blanco
                // Mantiene el color al pasar el mouse por encima
                '&:hover': {
                  bgcolor: '#D32F2F',
                },
              },
              // --- CAMBIO AQUÍ ---
              // Targeta a los botones NO seleccionados
              '& .MuiToggleButton-root': {
                 color: 'grey.700'
              }
            }}
          >
            <ToggleButton value="5" aria-label="5 percent tip">
              +5%
            </ToggleButton>
            <ToggleButton value="10" aria-label="10 percent tip">
              +10%
            </ToggleButton>
            <ToggleButton value="15" aria-label="15 percent tip">
              +15%
            </ToggleButton>
            <ToggleButton value="custom" aria-label="custom tip">
              +...%
            </ToggleButton>
          </ToggleButtonGroup>

          {tipPercent === 'custom' && (
            <TextField
              label="Custom %"
              type="number"
              value={customTip}
              onChange={handleCustomTipChange}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              fullWidth
              variant="outlined"
              size="small"
              sx={{ mt: 1, bgcolor: 'common.white' }}
            />
          )}
        </Stack>
      </Paper>

      {/* === CAJA DE TOTAL === */}
      <Paper
        elevation={0}
        sx={{ bgcolor: 'grey.200', p: 2, borderRadius: 2 }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {/* --- CAMBIO AQUÍ --- */}
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'grey.700' }}>
            Total:
          </Typography>
          {/* --- CAMBIO AQUÍ --- */}
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'grey.700' }}>
            {formatCurrency(value)}
          </Typography>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default SPAmount;