import { Box, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';

export function IncidentTimeline({ steps }: { steps: { title: string; description: string; time?: string }[] }) {
  return <Stack spacing={0}>{steps.map((step, index) => <motion.div key={step.title} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .06 }}><Stack direction="row" gap={2}><Stack alignItems="center"><Box sx={{ width: 34, height: 34, borderRadius: '50%', display: 'grid', placeItems: 'center', fontWeight: 900, color: '#06111f', background: 'linear-gradient(135deg,#38bdf8,#a78bfa)', boxShadow: '0 0 24px rgba(56,189,248,.32)' }}>{index + 1}</Box>{index < steps.length - 1 && <Box sx={{ width: 2, flex: 1, minHeight: 42, background: 'linear-gradient(#38bdf8, rgba(56,189,248,.1))' }} />}</Stack><Box sx={{ pb: 2.5 }}><Typography fontWeight={900}>{step.title}</Typography><Typography variant="body2" color="text.secondary">{step.description}</Typography>{step.time && <Typography variant="caption" color="primary.main">{step.time}</Typography>}</Box></Stack></motion.div>)}</Stack>;
}
