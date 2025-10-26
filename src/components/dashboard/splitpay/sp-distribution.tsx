'use client';

import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  Stack,
  Divider,
  Button
} from "@mui/material";
import { RestartAlt as RestartAltIcon } from '@mui/icons-material';

export interface Contact {
  id: string;
  name: string;
}

interface Allocation {
  id: string;
  name: string;
  amount: number | string; // Permite string vacío o entradas parciales como '.'
  percent: number | string; // Permite string vacío o entradas parciales como '.'
}

interface SPSplitTableProps {
  contacts: Contact[];
  total: number;
  currencySymbol?: string;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

// Nueva función para limpiar ceros a la izquierda y asegurar un formato de número válido
const cleanInput = (value: string): string => {
  // Maneja el caso de cadena vacía o solo punto
  if (value === '' || value === '.') return value;

  // Usa regex para eliminar ceros iniciales si no es '0' o '0.'
  let cleaned = value.replace(/^0+([1-9])/, '$1'); // 005 -> 5
  cleaned = cleaned.replace(/^0+(\.|$)/, '0$1'); // 00.5 -> 0.5, 00 -> 0

  return cleaned;
};

const SPSplitTable: React.FC<SPSplitTableProps> = ({
  contacts,
  total,
  currencySymbol = "$",
}) => {
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [mode, setMode] = useState<"auto" | "manual">("auto");

  // Función para inicializar o resetear al modo automático
  const initializeAutoMode = useCallback(() => {
    if (contacts.length === 0) {
      setAllocations([]);
      return;
    }

    const equalPercent = round2(100 / contacts.length);
    const equalAmount = round2(total / contacts.length);

    setAllocations(
      contacts.map((c) => ({
        id: c.id,
        name: c.name,
        amount: equalAmount,
        percent: equalPercent,
      }))
    );
    setMode("auto");
  }, [contacts, total]);

  // Inicializa allocations cuando cambian contactos o total, o si se resetea a 'auto'
  useEffect(() => {
    if (mode === "auto") {
      initializeAutoMode();
    }
    // NOTA: No incluimos initializeAutoMode en las dependencias para evitar bucle
    // ya que solo queremos que se ejecute la inicialización en 'auto' mode.
    // Al inicio, 'mode' es 'auto', por lo que se ejecuta.
    // La re-inicialización por cambio de `contacts` o `total` se maneja aquí.
    // Si la queremos en 'auto' al inicio, se ejecuta. Si `contacts` o `total` cambian,
    // se re-ejecuta solo si estamos en modo 'auto'.
    // Si queremos que el efecto solo se ejecute al inicio, y la función al llamar el botón
    // quitar `contacts` y `total` del array de dependencias.
    // Pero si `contacts` o `total` cambian y estamos en modo 'auto', es lógico recalcular.
  }, [contacts, total, mode, initializeAutoMode]);


  // Manejador para la edición de input
  const handleInputChange = (index: number, field: "amount" | "percent", rawValue: string) => {
    // 1. Limpiar ceros a la izquierda, pero permite '.' al final
    const cleanedValue = cleanInput(rawValue);

    // 2. Si el valor es solo un número válido (no vacío ni solo '.'), lo convertimos.
    const isNumber = !isNaN(Number(cleanedValue)) && cleanedValue !== '';
    const numericValue = isNumber ? Number(cleanedValue) : cleanedValue;

    // 3. Activar modo manual y vaciar los campos si no estábamos en manual
    if (mode === "auto") {
      setMode("manual");
      // Preparamos los allocations para vaciar el campo opuesto y los demás
      let newAllocations = allocations.map((a, i) => {
        // El campo que se está editando puede tener el valor limpiado (string o number)
        let updatedAllocation = { ...a };

        // Si es el campo que se está editando
        if (i === index) {
          if (field === "amount") {
            updatedAllocation.amount = numericValue as number | string;
            // Calculamos el porcentaje si es un número, si no, lo vaciamos
            updatedAllocation.percent = isNumber ? round2((numericValue as number / total) * 100) : '';
          } else {
            // field === "percent"
            updatedAllocation.percent = numericValue as number | string;
            // Calculamos el amount si es un número, si no, lo vaciamos
            updatedAllocation.amount = isNumber ? round2((numericValue as number / 100) * total) : '';
          }
          return updatedAllocation;
        }

        // Para los demás campos, los vaciamos
        return { ...a, amount: '', percent: '' };
      });
      setAllocations(newAllocations);
      return; // Detener el flujo para no ejecutar el cambio normal
    }

    // 4. Lógica para MODO MANUAL o después de la primera edición en AUTO
    let newAllocations = allocations.map((a) => ({ ...a }));
    
    // Si el valor es numérico, lo convertimos y calculamos el campo opuesto
    if (isNumber) {
        const val = numericValue as number;
        if (field === "amount") {
            newAllocations[index].amount = val;
            newAllocations[index].percent = round2((val / total) * 100);
        } else {
            newAllocations[index].percent = val;
            newAllocations[index].amount = round2((val / 100) * total);
        }
    } else {
        // Si el valor no es numérico (es '' o solo '.'), simplemente se guarda el string
        if (field === "amount") {
            newAllocations[index].amount = numericValue as string;
            newAllocations[index].percent = ''; // Vaciar el opuesto
        } else {
            newAllocations[index].percent = numericValue as string;
            newAllocations[index].amount = ''; // Vaciar el opuesto
        }
    }
    
    setAllocations(newAllocations);
  };


  // Función que se dispara al salir del foco de un campo
  const handleBlur = (index: number, field: "amount" | "percent") => {
      // Solo en modo manual, si el valor es un string vacío, lo convertimos a 0 para el cálculo total
      if (mode === "manual") {
          const copy = allocations.map(a => ({...a}));
          if (copy[index][field] === '') {
              // @ts-ignore - asignamos número para normalizar el valor tras el blur
              copy[index][field] = 0;
              // Recalcular el opuesto a 0 también
              if (field === "amount") {
                  copy[index].percent = 0;
              } else {
                  copy[index].amount = 0;
              }
              setAllocations(copy);
          }
      }
  };


  // Cálculos totales para el pie de tabla
  const totalAssigned = allocations.reduce((sum, a) => sum + (Number(a.amount) || 0), 0);
  const percentAssigned = allocations.reduce((sum, a) => sum + (Number(a.percent) || 0), 0);
  const remainingAmount = round2(total - totalAssigned);
  const remainingPercent = round2(100 - percentAssigned);


  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="h6">
          Allocation Split - <span style={{ color: mode === 'auto' ? 'green' : 'orange' }}>{mode.toUpperCase()} MODE</span>
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={initializeAutoMode} // 👈 Botón de reinicio
          startIcon={<RestartAltIcon />}
        >
          Auto Mode
        </Button>
      </Stack>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Contact</TableCell>
            <TableCell>Amount ({currencySymbol})</TableCell>
            <TableCell>%</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allocations.map((a, i) => (
            <TableRow key={a.id}>
              <TableCell>
                <Typography variant="body2">{a.name}</Typography>
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  type="text" // Cambiado a 'text' para permitir la limpieza de ceros con lógica JS
                  value={a.amount}
                  onChange={(e) => handleInputChange(i, "amount", e.target.value)}
                  onBlur={() => handleBlur(i, "amount")} // Manejar el blur
                  slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  type="text" // Cambiado a 'text'
                  value={a.percent}
                  onChange={(e) => handleInputChange(i, "percent", e.target.value)}
                  onBlur={() => handleBlur(i, "percent")} // Manejar el blur
                  slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Divider sx={{ my: 1 }} />
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2">
          **Total assigned:** {currencySymbol}
          {totalAssigned.toFixed(2)} / {percentAssigned.toFixed(2)}%
        </Typography>
        <Typography variant="body2" color={remainingAmount === 0 && remainingPercent === 0 ? "green" : "error"}>
          **Remaining:** {currencySymbol}
          {remainingAmount.toFixed(2)} / {remainingPercent.toFixed(2)}%
        </Typography>
      </Stack>
    </Paper>
  );
};

export default SPSplitTable;