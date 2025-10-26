'use client';

import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  Paper,
  MenuItem,
  Select,
  FormControl,
  SelectChangeEvent,
  Button,
  Divider,
  TextField,
  InputAdornment
} from "@mui/material";

// Tipo para un contacto
export interface Contact {
  id: string;
  name: string;
}

// Props para el componente
interface SPSplitTableProps {
  contacts: Contact[];
  total: number;
}

// --- Funciones Helper ---
const formatCurrency = (amount: number) => {
  if (isNaN(amount)) amount = 0;
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatPercentage = (value: number) => {
  if (isNaN(value)) value = 0;
  // Usamos toFixed(0) para porcentajes sin decimales
  return `${value.toFixed(0)}%`;
};

// --- Componente SPSplitTable ---
const SPSplitTable: React.FC<SPSplitTableProps> = ({ contacts, total }) => {
  const [splitMode, setSplitMode] = useState<'equal' | 'custom'>('equal');
  const [allocations, setAllocations] = useState<{
    [id: string]: { value: string; lastEdited: 'amount' | 'percent' }
  }>({});

  // --- INICIO DEL CAMBIO: Estilos para ocultar spinners ---
  const hideSpinnersSx = {
    // Oculta spinners en Chrome, Safari, Edge
    '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    },
    // Oculta spinners en Firefox
    '& input[type=number]': {
      '-moz-appearance': 'textfield'
    }
  };
  // --- FIN DEL CAMBIO ---

  useEffect(() => {
    const newAllocations: { [id: string]: { value: string; lastEdited: 'amount' | 'percent' } } = {};
    const numContacts = contacts.length;

    if (numContacts === 0 || total === 0) {
      contacts.forEach(contact => {
        newAllocations[contact.id] = { value: '0', lastEdited: 'amount' };
      });
    } else if (splitMode === 'equal') {
      const equalAmount = (total / numContacts).toFixed(2);
      contacts.forEach(contact => {
        newAllocations[contact.id] = { value: equalAmount, lastEdited: 'amount' };
      });
    } else {
      // Reinicia a 0 cuando se cambia a 'custom'
      contacts.forEach(contact => {
        newAllocations[contact.id] = { value: '0', lastEdited: 'amount' };
      });
    }
    setAllocations(newAllocations);
  }, [contacts, total, splitMode]);

  const calculatedAllocations = useMemo(() => {
    return contacts.map(contact => {
      const alloc = allocations[contact.id];
      if (!alloc) {
        return { ...contact, amount: 0, percentage: 0 };
      }

      const val = parseFloat(alloc.value);
      if (isNaN(val)) {
        return { ...contact, amount: 0, percentage: 0 };
      }

      if (splitMode === 'equal') {
        const amount = val;
        const percentage = (total > 0) ? (amount / total) * 100 : 0;
        return { ...contact, amount, percentage };
      }

      if (alloc.lastEdited === 'amount') {
        const amount = val;
        const percentage = (total > 0) ? (amount / total) * 100 : 0;
        return { ...contact, amount, percentage };
      } else { // 'percent'
        const percentage = val;
        const amount = (total * percentage) / 100;
        return { ...contact, amount, percentage };
      }
    });
  }, [allocations, contacts, total, splitMode]);

  const { amount: totalAmount, percentage: totalPercentage } = useMemo(() => {
    return calculatedAllocations.reduce(
      (acc, alloc) => {
        acc.amount += alloc.amount;
        acc.percentage += alloc.percentage;
        return acc;
      },
      { amount: 0, percentage: 0 }
    );
  }, [calculatedAllocations]);

  const { remainingAmount, remainingPercentage } = useMemo(() => {
    const remAmount = total - totalAmount;
    const remPercent = 100 - totalPercentage;
    return {
      remainingAmount: remAmount,
      remainingPercentage: remPercent,
    };
  }, [total, totalAmount, totalPercentage]);

  // --- Lógica de Validación (Botón y Colores) ---
  const isSplitDisabled = useMemo(() => {
    if (total === 0 || contacts.length === 0) return true;
    if (splitMode === 'equal') return false; // 'Equal' siempre es válido

    // En 'custom', las diferencias deben ser (casi) cero
    const amountDifference = Math.abs(totalAmount - total);
    const percentDifference = Math.abs(totalPercentage - 100);
    
    // Deshabilitado si la diferencia es mayor a 1 centavo O 1% (ajustamos % a 0.01 por si acaso)
    return amountDifference > 0.01 || percentDifference > 0.01;
  }, [total, contacts.length, splitMode, totalAmount, totalPercentage]);

  // --- Handlers ---
  const handleModeChange = (event: SelectChangeEvent<'equal' | 'custom'>) => {
    setSplitMode(event.target.value as 'equal' | 'custom');
  };

  const handleSplit = () => {
    alert("Split Confirmado:\n" + JSON.stringify(calculatedAllocations, null, 2));
  };

  const handleAllocationChange = (
    contactId: string,
    value: string,
    type: 'amount' | 'percent'
  ) => {
    setAllocations(prev => ({
      ...prev,
      [contactId]: { value: value, lastEdited: type }
    }));
  };

  return (
    <Stack spacing={2}>
      
      {/* === CAJA DE MODO === */}
      <Paper
        elevation={0}
        sx={{ bgcolor: 'grey.200', p: 2, borderRadius: 2 }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'grey.700' }}>
          Método:
        </Typography>
        <FormControl fullWidth>
          {/* --- INICIO DEL CAMBIO --- */}
          <Select
            value={splitMode}
            onChange={handleModeChange}
            sx={{
              bgcolor: 'common.white',
              borderRadius: 2,
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '& .MuiSelect-select': { color: 'grey.700' } // Color del valor seleccionado
            }}
          >
            <MenuItem value="equal" sx={{ color: 'grey.700' }}>
              Todos por igual
            </MenuItem>
            <MenuItem value="custom" sx={{ color: 'grey.700' }}>
              Personalizado
            </MenuItem>
          </Select>
          {/* --- FIN DEL CAMBIO --- */}
        </FormControl>
      </Paper>

      {/* --- TOTAL DE LA CUENTA --- */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'grey.100', 
          border: '1px solid',
          borderColor: 'grey.300',
          p: 1.5,
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'grey.700' }}>
          Total de la Cuenta:
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 'bold',
            color: 'grey.700',
          }}
        >
          {formatCurrency(total)} (100%)
        </Typography>
      </Paper>

      {/* === ENCABEZADO DE LA LISTA === */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'grey.200',
          p: '12px 16px',
          borderRadius: 2,
          display: 'grid',
          gridTemplateColumns: '1fr 100px 80px',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'grey.700' }}>
          Contacto:
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'right', color: 'grey.700' }}>
          $
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'right', color: 'grey.700' }}>
          %
        </Typography>
      </Paper>

      {/* === LISTA DE CONTACTOS Y TOTAL === */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'common.white',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'grey.200',
          overflow: 'hidden',
        }}
      >
        <Stack divider={<Divider flexItem />}>
          
          {/* --- Contenedor Scrolleable --- */}
          <Box
            sx={{
              height: 120,
              overflowY: 'auto',
              '&::-webkit-scrollbar': { width: '6px' },
              '&::-webkit-scrollbar-track': { background: '#f1f1f1' },
              '&::-webkit-scrollbar-thumb': { background: '#ccc', borderRadius: '3px' },
              '&::-webkit-scrollbar-thumb:hover': { background: '#aaa' }
            }}
          >
            {/* --- Filas de Contactos --- */}
            {calculatedAllocations.map((contact) => (
              <Box
                key={contact.id}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 100px 80px',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.5,
                  borderBottom: '1px solid',
                  borderColor: 'grey.200',
                  '&:last-child': {
                    borderBottom: 'none'
                  }
                }}
              >
                <Typography variant="body1" noWrap sx={{ fontWeight: 500, color: 'grey.700' }}>
                  {contact.name}
                </Typography>
                
                {splitMode === 'equal' ? (
                  <>
                    <Typography variant="body1" sx={{ textAlign: 'right', color: 'grey.700' }}>
                      {formatCurrency(contact.amount)}
                    </Typography>
                    <Typography variant="body1" sx={{ textAlign: 'right', color: 'grey.700' }}>
                      {formatPercentage(contact.percentage)}
                    </Typography>
                  </>
                ) : (
                  <>
                    <TextField
                      type="number"
                      size="small"
                      value={allocations[contact.id]?.lastEdited === 'amount' ? allocations[contact.id]?.value : contact.amount.toFixed(2)}
                      onChange={(e) => handleAllocationChange(contact.id, e.target.value, 'amount')}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        sx: { fontSize: '0.9rem' }
                      }}
                      sx={hideSpinnersSx} 
                    />
                    <TextField
                      type="number"
                      size="small"
                      value={allocations[contact.id]?.lastEdited === 'percent' ? allocations[contact.id]?.value : contact.percentage.toFixed(0)}
                      onChange={(e) => handleAllocationChange(contact.id, e.target.value, 'percent')}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        sx: { fontSize: '0.9rem' }
                      }}
                      sx={hideSpinnersSx} 
                    />
                  </>
                )}
              </Box>
            ))}
          </Box>
          
          {/* --- Fila de Total (Running Total) --- */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 100px 80px',
              alignItems: 'center',
              gap: 1.5,
              p: 2,
              bgcolor: 'grey.50'
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'grey.700' }}>
              Total Asignado
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold', 
                textAlign: 'right',
                color: isSplitDisabled ? 'error.main' : 'primary.main'
              }}
            >
              {formatCurrency(totalAmount)}
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold', 
                textAlign: 'right',
                color: isSplitDisabled ? 'error.main' : 'primary.main'
              }}
            >
              {formatPercentage(totalPercentage)}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* --- APARTADO "RESTANTE" --- */}
      {splitMode === 'custom' && (
        <Paper
          elevation={0}
          sx={{
            bgcolor: isSplitDisabled ? 'rgba(211, 47, 47, 0.08)' : 'rgba(0, 118, 255, 0.08)',
            p: 1.5,
            borderRadius: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: 'bold', 
              color: isSplitDisabled ? 'error.main' : 'primary.main'
            }}
          >
            {isSplitDisabled 
              ? (remainingAmount > 0 ? 'Faltante:' : 'Sobrante:')
              : 'Asignación Completa'}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 'bold',
              color: isSplitDisabled ? 'error.main' : 'primary.main'
            }}
          >
            {isSplitDisabled
              ? `${formatCurrency(Math.abs(remainingAmount))} (${formatPercentage(Math.abs(remainingPercentage))})`
              : `${formatCurrency(0)} (0%)`
            }
          </Typography>
        </Paper>
      )}

      {/* === BOTÓN SPLIT === */}
      <Button
        variant="contained"
        fullWidth
        onClick={handleSplit}
        sx={{
          mt: 2,
          py: 1.5,
          fontSize: '1.1rem',
          fontWeight: 'bold',
          borderRadius: 2.5,
          textTransform: 'none',
          boxShadow: '0 4px 14px 0 rgba(0, 118, 255, 0.39)',
        }}
        disabled={isSplitDisabled}
      >
        Split
      </Button>
    </Stack>
  );
};

export default SPSplitTable;