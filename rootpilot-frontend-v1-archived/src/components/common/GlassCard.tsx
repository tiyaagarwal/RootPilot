import { Box, Card, type CardProps } from '@mui/material';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function GlassCard({ children, glow = '#38bdf8', interactive = false, sx, ...props }: CardProps & { children: ReactNode; glow?: string; interactive?: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={interactive ? { y: -2 } : undefined} transition={{ duration: 0.2, ease: 'easeOut' }} style={{ height: '100%' }}>
      <Card
        sx={{
          position: 'relative',
          overflow: 'hidden',
          height: '100%',
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          ...sx
        }}
        {...props}
      >
        <Box sx={{ position: 'relative', zIndex: 1, height: '100%' }}>{children}</Box>
      </Card>
    </motion.div>
  );
}
