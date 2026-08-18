import { useMemo, useState } from 'react';
import {
  Box, CardContent, Drawer, Grid, InputAdornment, MenuItem, Select, Stack,
  Table, TableBody, TableCell, TableHead, TablePagination, TableRow,
  TextField, Typography, Button, Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../components/common/PageHeader';
import { usePlatformQuery } from '../hooks/usePlatformQuery';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { incidentService, rootCauseService, changeService } from '../services/platformServices';
import type { Incident } from '../types/backend';
import { StatusPill } from '../components/common/StatusPill';
import { GlassCard } from '../components/common/GlassCard';
import { IncidentTimeline } from '../components/visual/IncidentTimeline';
import { LoadingState } from '../components/feedback/LoadingState';
import { ErrorState } from '../components/feedback/ErrorState';
import { EmptyState } from '../components/feedback/EmptyState';
import { OperationalMemoryPanel } from '../components/ai/OperationalMemoryPanel';
import { NarrativeBanner } from '../components/ai/NarrativeBanner';

/** Derive a severity label from the HTTP status code. */
function deriveSeverity(statusCode: number): string {
  if (statusCode >= 500) return 'HIGH';
  if (statusCode >= 400) return 'MEDIUM';
  return 'LOW';
}

/** Loads and renders Operational Memory (similar incidents) for a given incident. */
function IncidentSimilarPanel({ incidentId, onNavigate }: { incidentId: number; onNavigate?: (id: number) => void }) {
  const { data: similar = [], isLoading } = useQuery({
    queryKey: ['incident-similar', incidentId],
    queryFn: () => incidentService.similar(incidentId),
    enabled: incidentId > 0,
    staleTime: 120_000,
  });
  return <OperationalMemoryPanel incidents={similar} isLoading={isLoading} onNavigate={onNavigate} />;
}

export function IncidentsPage() {
  useDocumentTitle('Incidents');
  const navigate = useNavigate();
  const { data = [], isLoading, isError } = usePlatformQuery(['incidents'], incidentService.list);
  const rca = usePlatformQuery(['rca-recommendations'], rootCauseService.recommendations);


  const [query, setQuery] = useState('');
  const [service, setService] = useState('ALL');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Incident | null>(null);

  const services = useMemo(() => ['ALL', ...Array.from(new Set(data.map((i) => i.serviceName)))], [data]);

  const filtered = useMemo(
    () =>
      data.filter(
        (i) =>
          (service === 'ALL' || i.serviceName === service) &&
          JSON.stringify(i).toLowerCase().includes(query.toLowerCase()),
      ),
    [data, query, service],
  );

  if (isLoading) return <LoadingState cards={3} />;
  if (isError) {
    return (
      <ErrorState
        queryKey={['incidents']}
        title="Incidents Unavailable"
        description="Unable to load incident data. Verify the platform backend is running and reachable."
      />
    );
  }

  const selectedRcas = rca.data?.filter((r) => r.serviceName === selected?.serviceName) ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Incident Management"
        title="Enterprise Incident Explorer"
        description="Search, filter, and investigate every incident across your platform — with AI-powered root cause evidence attached."
        action={<StatusPill value={`${filtered.length} MATCHES`} />}
      />

      <GlassCard glow="#2563EB">
        <CardContent sx={{ p: 2.5 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2.5 }}>
            <TextField
              fullWidth
              placeholder="Search incidents, exceptions, endpoints..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
            />
            <Select
              value={service}
              onChange={(e) => setService(e.target.value)}
              sx={{ minWidth: 220 }}
            >
              {services.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </Stack>

          {filtered.length === 0 ? (
            <EmptyState title="No Matching Incidents" description="Adjust your search or filter criteria." compact />
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Incident ID</TableCell>
                    <TableCell>Service</TableCell>
                    <TableCell>Severity</TableCell>
                    <TableCell>Status Code</TableCell>
                    <TableCell>Latency</TableCell>
                    <TableCell>Exception</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.slice(page * 8, page * 8 + 8).map((i) => (
                    <TableRow
                      key={i.id}
                      hover
                      onClick={() => setSelected(i)}
                      sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#F3F4F6' } }}
                    >
                      <TableCell><Typography fontWeight={700}>#{i.id}</Typography></TableCell>
                      <TableCell>{i.serviceName}</TableCell>
                      <TableCell><StatusPill value={deriveSeverity(i.statusCode)} /></TableCell>
                      <TableCell>{i.statusCode}</TableCell>
                      <TableCell>{i.latency}ms</TableCell>
                      <TableCell>{i.exceptionType}</TableCell>
                      <TableCell>{new Date(i.timestamp).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={filtered.length}
                page={page}
                onPageChange={(_, p) => setPage(p)}
                rowsPerPage={8}
                rowsPerPageOptions={[8]}
              />
            </>
          )}
        </CardContent>
      </GlassCard>

      {/* Incident Detail Drawer */}
      <Drawer
        anchor="right"
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        PaperProps={{
          sx: { width: { xs: '100%', md: 560 }, bgcolor: 'background.paper', p: 3, borderLeft: '1px solid', borderColor: 'divider' },
        }}
      >
        {selected && (
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h4" fontWeight={700}>Incident #{selected.id}</Typography>
                <Typography color="text.secondary" variant="body2">{selected.serviceName} · {selected.endpoint}</Typography>
              </Box>
              <Stack spacing={1} alignItems="flex-end">
                <StatusPill value={deriveSeverity(selected.statusCode)} />
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<PlayArrowIcon />}
                  onClick={() => navigate(`/incidents/${selected.id}/replay`)}
                  id={`incident-replay-btn-${selected.id}`}
                  aria-label={`Replay incident ${selected.id}`}
                >
                  Replay
                </Button>
              </Stack>
            </Stack>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              {[
                ['Status Code', selected.statusCode],
                ['Latency', `${selected.latency}ms`],
                ['Exception', selected.exceptionType],
                ['Version', selected.version],
              ].map(([k, v]) => (
                <Grid item xs={6} key={k}>
                  <GlassCard glow="#2563EB">
                    <CardContent>
                      <Typography variant="overline" color="text.secondary">{k}</Typography>
                      <Typography variant="h6" fontWeight={700}>{v}</Typography>
                    </CardContent>
                  </GlassCard>
                </Grid>
              ))}
            </Grid>

            {/* RCA Evidence — from real backend, not hardcoded */}
            <Typography variant="h6" sx={{ mt: 3, fontWeight: 700 }}>Root Cause Evidence</Typography>
            {selectedRcas.length === 0 ? (
              <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
                {rca.isError
                  ? 'Could not load RCA recommendations.'
                  : 'No RCA recommendations for this service in the current window.'}
              </Typography>
            ) : (
              selectedRcas.map((r) => (
                <GlassCard glow="#DC2626" sx={{ mt: 1 }} key={r.recommendation}>
                  <CardContent>
                    <StatusPill value={r.riskLevel} />
                    <Typography sx={{ mt: 1 }} fontWeight={700}>{r.recommendation}</Typography>
                    <Typography color="text.secondary" variant="body2">{r.reason}</Typography>
                  </CardContent>
                </GlassCard>
              ))
            )}

            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Incident Timeline</Typography>
            <IncidentTimeline
              steps={[
                {
                  title: 'Detected',
                  description: `${selected.exceptionType} captured on ${selected.endpoint}`,
                  time: selected.timestamp,
                },
                {
                  title: 'Correlated',
                  description: 'RootPilot matched service, exception, and latency signals.',
                },
                {
                  title: 'RCA Queried',
                  description: selectedRcas.length > 0
                    ? `${selectedRcas.length} recommendation(s) found for ${selected.serviceName}.`
                    : 'No RCA match found in the current recommendation window.',
                },
              ]}
            />

            {/* Operational Memory — Similar Past Incidents */}
            <Divider sx={{ my: 2 }} />
            <IncidentSimilarPanel incidentId={selected.id} onNavigate={(id) => { setSelected(null); navigate(`/incidents/${id}/replay`); }} />
          </Box>
        )}
      </Drawer>
    </>
  );
}
