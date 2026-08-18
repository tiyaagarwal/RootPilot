import { Box, Chip, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <Stack direction={{ xs: 'column', lg: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', lg: 'center' }} gap={2} sx={{ mb: 3 }}>
        <Box>
          <Chip
            label={eyebrow}
            size="small"
            sx={{
              mb: 1.2,
              fontWeight: 600,
              letterSpacing: '.05em',
              bgcolor: '#DBEAFE',
              color: '#2563EB',
              border: 'none',
              fontSize: 11
            }}
          />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              letterSpacing: '-.03em',
              color: 'text.primary'
            }}
          >
            {title}
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 920, mt: 1, fontSize: 14 }}>
            {description}
          </Typography>
        </Box>
        {action}
      </Stack>
    </motion.div>
  );
}
