import { useMemo, useState } from 'react';
import {
  Box, CardContent, Table, TableBody, TableCell, TableHead, TableRow,
  TableSortLabel, Typography,
} from '@mui/material';
import { GlassCard } from './GlassCard';
import { EmptyState } from '../feedback/EmptyState';

type Order = 'asc' | 'desc';

interface SortableTableProps {
  title: string;
  rows: object[];
  columns: { key: string; label?: string; numeric?: boolean; renderCell?: (value: unknown, row: Record<string, unknown>) => React.ReactNode }[];
  defaultSort?: string;
  defaultOrder?: Order;
  maxRows?: number;
  glow?: string;
}

function descendingComparator(a: Record<string, unknown>, b: Record<string, unknown>, orderBy: string): number {
  const av = a[orderBy] ?? '';
  const bv = b[orderBy] ?? '';
  if (bv < av) return -1;
  if (bv > av) return 1;
  return 0;
}

export function SortableTable({
  title,
  rows,
  columns,
  defaultSort,
  defaultOrder = 'desc',
  maxRows,
  glow = '#38bdf8',
}: SortableTableProps) {
  const [orderBy, setOrderBy] = useState<string>(defaultSort ?? columns[0]?.key ?? '');
  const [order, setOrder] = useState<Order>(defaultOrder);

  const handleSort = (key: string) => {
    if (orderBy === key) {
      setOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setOrderBy(key);
      setOrder('desc');
    }
  };

  const sorted = useMemo(() => {
    const typed = rows as Record<string, unknown>[];
    return [...typed].sort((a, b) =>
      order === 'asc'
        ? descendingComparator(b, a, orderBy)
        : descendingComparator(a, b, orderBy),
    );
  }, [rows, order, orderBy]);

  const display = maxRows ? sorted.slice(0, maxRows) : sorted;

  return (
    <GlassCard glow={glow}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {title}
        </Typography>
        {rows.length === 0 ? (
          <EmptyState compact />
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {columns.map((col) => (
                    <TableCell key={col.key} sortDirection={orderBy === col.key ? order : false}>
                      <TableSortLabel
                        active={orderBy === col.key}
                        direction={orderBy === col.key ? order : 'asc'}
                        onClick={() => handleSort(col.key)}
                      >
                        {col.label ?? col.key}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {display.map((row, i) => (
                  <TableRow key={i} hover>
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        {col.renderCell
                          ? col.renderCell(row[col.key], row)
                          : typeof row[col.key] === 'boolean'
                            ? String(row[col.key])
                            : String(row[col.key] ?? '')}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </CardContent>
    </GlassCard>
  );
}
