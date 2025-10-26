'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';

import { useSelection } from '@/hooks/use-selection';

export interface Customer {
  id: string;
  avatar?: string;
  name: string;
  createdAt?: Date;
}

interface CustomersTableProps {
  count?: number;
  page?: number;
  rows?: Customer[];
  rowsPerPage?: number;
  onSelectionChange?: (selected: Customer[]) => void;
  onContinue?: () => void;
}

export default function SpContacts({
  rows = [],
  onSelectionChange,
  onContinue,
}: CustomersTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((customer) => customer.id);
  }, [rows]);

  const { deselectOne, selectOne, selected } = useSelection(rowIds);

  React.useEffect(() => {
    const selectedSet = selected ?? new Set<string>();
    const selectedContacts = rows.filter((r) => selectedSet.has(r.id));
    onSelectionChange?.(selectedContacts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, rows]);

  const getInitials = (name: string): string => {
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + (parts[1][0] || '')).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  return (
    // CAMBIO 1: Quitado 'height: 100%' y 'display: flex'
    <Box sx={{ p: 2, bgcolor: 'background.default' }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main', textAlign: 'center' }}>
        Splitters
      </Typography>

      {/* CAMBIO 2: Quitado 'flexGrow: 1' */}
      <Card sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
        {/* CAMBIO 3: Cambiado 'maxHeight' a un valor más estable como '60vh' (60% de la altura de la pantalla) */}
        <Box sx={{ overflowY: 'auto', maxHeight: '60vh' }}>
          <Table sx={{ minWidth: '300px' }}>
            <TableBody>
              {rows.map((row) => {
                const isSelected = selected?.has(row.id);

                return (
                  <TableRow
                    hover
                    key={row.id}
                    selected={isSelected}
                    onClick={() => {
                      if (isSelected) {
                        deselectOne(row.id);
                      } else {
                        selectOne(row.id);
                      }
                    }}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox" sx={{ width: '40px' }}>
                      <Checkbox
                        checked={isSelected}
                        sx={{
                          color: isSelected ? 'primary.main' : 'text.secondary',
                          '& .MuiSvgIcon-root': {
                            borderRadius: '50%',
                            border: `2px solid ${isSelected ? 'primary.main' : 'grey.400'}`,
                            fontSize: 22,
                            backgroundColor: isSelected ? 'primary.main' : 'transparent',
                            color: isSelected ? 'common.white' : 'transparent',
                          },
                          '&.Mui-checked .MuiSvgIcon-root': {
                            backgroundColor: 'primary.main',
                            borderColor: 'primary.main',
                          },
                          '&.Mui-checked:hover .MuiSvgIcon-root': {
                            backgroundColor: 'primary.dark',
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ borderBottom: 'none' }}>
                      <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                        <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.contrastText', width: 40, height: 40, fontSize: '0.875rem' }}>
                          {row.avatar ? <img src={row.avatar} alt={row.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : getInitials(row.name)}
                        </Avatar>
                        <Typography variant="subtitle1">{row.name}</Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Card>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        // CAMBIO 4: Cambiado 'mt: auto' por 'mt: 2'
        sx={{ mt: 2, p: 1.5, borderRadius: 2, fontSize: '1.1rem' }}
        onClick={onContinue}
        disabled={(selected?.size ?? 0) === 0}
      >
        Continuar
      </Button>
    </Box>
  );
}