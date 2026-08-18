import { Chip } from '@mui/material';

const colorFor = (value: string) => {
  const v = value?.toUpperCase?.() ?? '';
  if (v.includes('CRITICAL') || v.includes('HIGH') || v.includes('DEGRADED') || v.includes('RISK')) return 'error';
  if (v.includes('MEDIUM') || v.includes('WATCH') || v.includes('PENDING')) return 'warning';
  if (v.includes('LOW') || v.includes('READY') || v.includes('HEALTHY') || v.includes('UP')) return 'success';
  return 'primary';
};

export function StatusPill({ value }: { value: string }) {
  return <Chip size="small" label={value || 'N/A'} color={colorFor(value)} sx={{ fontWeight: 800, letterSpacing: '.04em' }} />;
}
