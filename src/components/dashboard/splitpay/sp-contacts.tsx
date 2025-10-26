'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import { useSelection } from '@/hooks/use-selection';

function noop(): void {
  // do nothing
}

export interface Customer {
  id: string;
  avatar: string;
  name: string;
  createdAt: Date;
}

interface CustomersTableProps {
  count?: number;
  page?: number;
  rows?: Customer[];
  rowsPerPage?: number;
  /**
   * Callback invoked when selection changes. Receives the currently selected customers.
   */
  onSelectionChange?: (selected: Customer[]) => void;
}

export default function SpContacts({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  onSelectionChange,
}: CustomersTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((customer) => customer.id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  // Notify parent about selected contacts whenever selection or rows change
  React.useEffect(() => {
    const selectedSet = selected ?? new Set<string>();
    const selectedContacts = rows.filter((r) => selectedSet.has(r.id));
    onSelectionChange?.(selectedContacts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, rows]); // <-- ARREGLO AQUÍ

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                {/* --- INICIO DEL CAMBIO --- */}
                <Checkbox
                  // color="error" <-- Se quita
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                  sx={{
                    color: 'grey.700', // Color del borde (no seleccionado)
                    '&.Mui-checked': {
                      color: 'error.main', // Color (seleccionado)
                    },
                    '&.Mui-indeterminate': {
                      color: 'error.main', // Color (indeterminado)
                    },
                  }}
                />
                {/* --- FIN DEL CAMBIO --- */}
              </TableCell>
              <TableCell sx={{ color: 'grey.700', fontWeight: 'bold' }}>Contactos</TableCell>
              <TableCell sx={{ color: 'grey.700' }}>Email</TableCell>
              <TableCell sx={{ color: 'grey.700' }}>Phone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected?.has(row.id);

              return (
                <TableRow hover key={row.id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    {/* --- INICIO DEL CAMBIO --- */}
                    <Checkbox
                      // color="error" <-- Se quita
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.id);
                        } else {
                          deselectOne(row.id);
                        }
                      }}
                      sx={{
                        color: 'grey.700', // Color del borde (no seleccionado)
                        '&.Mui-checked': {
                          color: 'error.main', // Color (seleccionado)
                        },
                      }}
                    />
                    {/* --- FIN DEL CAMBIO --- */}
                  </TableCell>
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <Avatar src={row.avatar} />
                      <Typography variant="subtitle2" sx={{ color: 'grey.700' }}>
                        {row.name}
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={noop}
        onRowsPerPageChange={noop}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}