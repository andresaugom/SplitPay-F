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
          Modo:
        </Typography>
        <FormControl fullWidth>
          <Select
            value={splitMode}
            onChange={handleModeChange}
            sx={{
              bgcolor: 'common.white',
              borderRadius: 2,
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            }}
          >
            <MenuItem value="equal">Todos por igual</MenuItem>
            <MenuItem value="custom">Personalizado</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* --- INICIO CAMBIO 1: APARTADO "TOTAL DE LA CUENTA" --- */}
      {/* Esta caja SIEMPRE es visible para recordar el objetivo */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'grey.100', // Un fondo neutro
          border: '1px solid',
          borderColor: 'grey.300',
          p: 1.5,
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          Total de la Cuenta:
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 'bold',
          }}
        >
          {formatCurrency(total)} (100%)
        </Typography>
      </Paper>
      {/* --- FIN CAMBIO 1 --- */}

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
              }}
            >
              <Typography variant="body1" noWrap sx={{ fontWeight: 500 }}>
                {contact.name}
              </Typography>
              
              {splitMode === 'equal' ? (
                <>
                  <Typography variant="body1" sx={{ textAlign: 'right' }}>
                    {formatCurrency(contact.amount)}
                  </Typography>
                  <Typography variant="body1" sx={{ textAlign: 'right' }}>
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
                  />
                </>
              )}
            </Box>
          ))}
          
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
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Total Asignado
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold', 
                textAlign: 'right',
                // Lógica de color: rojo si es incorrecto, azul si es correcto
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

      {/* --- INICIO CAMBIO 2: APARTADO "RESTANTE" (REEMPLAZA AL ANTERIOR) --- */}
      {/* Esta caja solo aparece en modo 'custom' */}
      {splitMode === 'custom' && (
        <Paper
          elevation={0}
          sx={{
            // Rojo si está deshabilitado (incorrecto), Azul si está habilitado (correcto)
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
            {/* Cambia el texto: si está correcto, dice "Completo". Si no, dice qué pasa. */}
            {isSplitDisabled 
              ? (remainingAmount > 0 ? 'Falta por asignar:' : 'Sobra:')
              : 'Asignación Completa'}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 'bold',
              color: isSplitDisabled ? 'error.main' : 'primary.main'
            }}
          >
            {/* Muestra cuánto falta/sobra. Si está correcto, muestra $0.00 */}
            {isSplitDisabled
              ? `${formatCurrency(Math.abs(remainingAmount))} (${formatPercentage(Math.abs(remainingPercentage))})`
              : `${formatCurrency(0)} (0%)`
            }
          </Typography>
        </Paper>
      )}
      {/* --- FIN CAMBIO 2 --- */}

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
        // La lógica de 'disabled' ya estaba correcta y conectada
        disabled={isSplitDisabled}
      >
        Split
      </Button>
    </Stack>
  );
};

export default SPSplitTable;