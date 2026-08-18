import { Box, Grid, Skeleton, Stack } from '@mui/material';
import { motion } from 'framer-motion';

export function LoadingState({ cards = 6 }: { cards?: number }) {
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Stack spacing={3}><Skeleton variant="rounded" height={96} sx={{ borderRadius: 5, bgcolor: 'rgba(148,163,184,.10)' }} /><Grid container spacing={2}>{Array.from({ length: cards }, (_, i) => <Grid item xs={12} md={4} key={i}><Box sx={{ p: 2, borderRadius: 5, bgcolor: 'rgba(15,23,42,.64)', border: '1px solid rgba(148,163,184,.12)' }}><Skeleton width="42%" /><Skeleton width="70%" height={54} /><Skeleton variant="rounded" height={8} sx={{ mt: 2, borderRadius: 99 }} /></Box></Grid>)}</Grid><Skeleton variant="rounded" height={320} sx={{ borderRadius: 5, bgcolor: 'rgba(148,163,184,.10)' }} /></Stack></motion.div>;
}
