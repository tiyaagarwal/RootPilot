import { Avatar, Box, Button, CardContent, Divider, List, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { GlassCard } from '../common/GlassCard';
import { StatusPill } from '../common/StatusPill';

export function AiCopilotPanel({ title = 'RootPilot Copilot', summary, recommendations }: { title?: string; summary?: string; recommendations: { severity: string; message: string }[] }) {
  return (
    <GlassCard glow="#2563EB" sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" alignItems="center" gap={1.4} sx={{ mb: 1.5 }}>
          <Avatar sx={{ bgcolor: '#2563EB', color: '#FFFFFF' }}><PsychologyIcon /></Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700} color="text.primary">{title}</Typography>
            <Typography variant="body2" color="text.secondary">AI-generated operational guidance</Typography>
          </Box>
        </Stack>
        <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#F3F4F6', border: '1px solid', borderColor: 'divider', mb: 1.5 }}>
          <Typography variant="body2" color="text.primary">{summary ?? 'RootPilot is correlating incident pressure, dependency risk, and readiness signals to recommend the safest next action.'}</Typography>
        </Box>
        <List disablePadding>
          {recommendations.slice(0, 4).map((item) => (
            <ListItem key={item.message} disableGutters sx={{ py: 1.0 }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: '#DBEAFE', color: '#2563EB' }}><AutoFixHighIcon fontSize="small" /></Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="body2" fontWeight={600} color="text.primary">{item.message}</Typography>}
                secondary={<StatusPill value={item.severity} />}
              />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 1.5 }} />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<AutoFixHighIcon />}
          sx={{ py: 1.15 }}
        >
          Open remediation workspace
        </Button>
      </CardContent>
    </GlassCard>
  );
}
