import React from 'react';
import { Box, Card, CardContent, CardHeader, Grid, Typography, Stack, Button, Table, TableBody, TableCell, TableHead, TableRow, LinearProgress, Chip, IconButton } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

import { PageHeader } from '../components/common/PageHeader';
import { StatusPill } from '../components/common/StatusPill';
import { ServiceGraph } from '../components/graphs/ServiceGraph';
import { useUiStore } from '../store/uiStore';
import { usePlatformQuery } from '../hooks/usePlatformQuery';
import { rootCauseService, dependencyService } from '../services/platformServices';
import { LoadingState } from '../components/feedback/LoadingState';
import { ErrorState } from '../components/feedback/ErrorState';
import { EmptyState } from '../components/feedback/EmptyState';

export function RcaPage() {
  const { openCopilot } = useUiStore();

  const rcaSummary = usePlatformQuery(['rca-summary-page'], rootCauseService.rcaSummary);
  const recommendations = usePlatformQuery(['rca-recommendations-page'], rootCauseService.recommendations);
  const dependencies = usePlatformQuery(['rca-dependencies-page'], dependencyService.dependencies);

  const isLoading = rcaSummary.isLoading || recommendations.isLoading || dependencies.isLoading;

  if (isLoading) return <LoadingState cards={3} />;
  if (rcaSummary.isError) {
    return <ErrorState title="RCA Analytics Offline" refetch={() => rcaSummary.refetch()} />;
  }

  const rca = rcaSummary.data as any;
  const recs = recommendations.data || [];
  const deps = dependencies.data || [];

  return (
    <Box>
      <PageHeader
        eyebrow="root cause analysis"
        title="RCA Workbench"
        description="Explainable AI diagnostics. Identify root cause anomalies, trace service dependencies, and retrieve recommendations."
      />

      <Stack spacing={2}>
        {/* Active Root Cause Indicator */}
        <Card sx={{ borderLeft: '3px solid #EF4444' }}>
          <CardHeader title="Probable Root Cause Verdict" />
          <CardContent sx={{ pt: 0.5 }}>
            <Typography variant="body1" sx={{ color: '#EF4444', fontWeight: 800, mb: 1, fontSize: '0.92rem' }}>
              {rca?.topService} — {rca?.topException}
            </Typography>
            <Typography variant="body2" sx={{ color: '#F1F5F9', mb: 2 }}>
              {rca?.probableRootCause || 'No active root cause verified.'}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<SmartToyIcon sx={{ fontSize: 14 }} />}
              onClick={() => openCopilot({
                type: 'incident',
                name: rca?.topService,
                id: 101 // active triage incident
              })}
              sx={{ borderColor: '#242C3F', color: '#60A5FA' }}
            >
              Analyze cascading impact with Copilot
            </Button>
          </CardContent>
        </Card>

        {/* Dependency Topology Graph */}
        {deps.length > 0 ? (
          <ServiceGraph title="RCA Evidence Relationship Graph" dependencies={deps} mode="dependency" />
        ) : (
          <Card>
            <CardHeader title="Relationship Graph" />
            <CardContent>
              <EmptyState title="Topology Map Unavailable" description="No active dependency chains mapped for root cause triage." />
            </CardContent>
          </Card>
        )}

        {/* Detailed Anomaly Detections */}
        <Card>
          <CardHeader title="Statistical Anomaly Detections (Z-Score > 3)" />
          <CardContent sx={{ p: 0 }}>
            {recs.length > 0 ? (
              <Table className="compact-table">
                <TableHead>
                  <TableRow>
                    <TableCell>Service</TableCell>
                    <TableCell>Metric Type</TableCell>
                    <TableCell>Z-Score</TableCell>
                    <TableCell>Current Value</TableCell>
                    <TableCell>Baseline Mean</TableCell>
                    <TableCell>Severity</TableCell>
                    <TableCell align="right">Diagnostic</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recs.map((rec: any, idx: number) => {
                    const zVal = Number(rec.zscore || rec.zScore || 0).toFixed(2);
                    return (
                      <TableRow key={idx}>
                        <TableCell sx={{ fontWeight: 700, color: '#E2E8F0' }}>
                          {rec.serviceName}
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#60A5FA' }}>
                          {rec.metricType}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 800, color: Math.abs(rec.zScore) > 5.0 ? '#EF4444' : '#F59E0B' }}>
                          {zVal}
                        </TableCell>
                        <TableCell sx={{ color: '#F1F5F9' }}>
                          {Number(rec.currentValue).toFixed(2)}
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary' }}>
                          {Number(rec.baselineValue).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <StatusPill value={rec.severity || 'HIGH'} />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => openCopilot({
                              type: 'service',
                              name: rec.serviceName
                            })}
                            sx={{ color: '#60A5FA' }}
                          >
                            <SmartToyIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">No statistical anomalies resolved.</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
