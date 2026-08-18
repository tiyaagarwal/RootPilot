import { Grid, Stack } from '@mui/material';
import { PageHeader } from '../components/common/PageHeader';
import { KpiCard } from '../components/common/KpiCard';
import { SortableTable } from '../components/common/SortableTable';
import { ServiceGraph } from '../components/graphs/ServiceGraph';
import { StatusPill } from '../components/common/StatusPill';
import { usePlatformQuery } from '../hooks/usePlatformQuery';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { correlationService, dependencyService } from '../services/platformServices';
import { LoadingState } from '../components/feedback/LoadingState';
import { ErrorState } from '../components/feedback/ErrorState';

export function CorrelationPage() {
  useDocumentTitle('Correlation Engine');
  const c = usePlatformQuery(['correlations'], correlationService.correlations);
  const deps = usePlatformQuery(['graph-deps'], dependencyService.dependencies);
  const recent = usePlatformQuery(['recent-correlations'], correlationService.recentCorrelations);

  if (c.isLoading) return <LoadingState cards={3} />;
  if (c.isError) return <ErrorState queryKey={['correlations']} title="Correlations Unavailable" />;

  const correlations = c.data ?? [];
  const topCorrelation = [...correlations].sort(
    (a, b) => Number(b.incidentCount ?? 0) - Number(a.incidentCount ?? 0),
  )[0];

  return (
    <>
      <PageHeader
        eyebrow="Correlation Engine"
        title="Incident Relationship Intelligence"
        description="AI-powered cross-service correlation — identifying related incident groups, shared exceptions, and cascading failure patterns across your platform."
        action={<StatusPill value={`${correlations.length} GROUPS`} />}
      />
      <Stack spacing={2.5}>
        {/* Top correlation KPIs */}
        {topCorrelation && (
          <Grid container spacing={2.2}>
            <Grid item xs={12} md={4}>
              <KpiCard
                label="Top Correlation"
                value={String(topCorrelation.service ?? 'N/A')}
                helper={String(topCorrelation.exception ?? '')}
                progress={Math.min(100, Number(topCorrelation.incidentCount ?? 0) / 2)}
                accent="#2563EB"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <KpiCard
                label="Peak Incident Count"
                value={Number(topCorrelation.incidentCount ?? 0)}
                helper="In top correlation group"
                accent="#2563EB"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <KpiCard
                label="Total Correlation Groups"
                value={correlations.length}
                helper="Backend correlation windows"
                accent="#2563EB"
              />
            </Grid>
          </Grid>
        )}

        {/* All correlation groups */}
        <SortableTable
          title="Correlation Groups"
          rows={correlations}
          columns={[
            { key: 'service', label: 'Service' },
            { key: 'exception', label: 'Exception' },
            { key: 'incidentCount', label: 'Incident Count', numeric: true },
          ]}
          defaultSort="incidentCount"
        />

        {/* Recent correlations */}
        {!recent.isError && (
          <SortableTable
            title="Recent Correlation Groups"
            rows={recent.data ?? []}
            columns={[
              { key: 'service', label: 'Service' },
              { key: 'exception', label: 'Exception' },
              { key: 'incidentCount', label: 'Incident Count', numeric: true },
            ]}
            defaultSort="incidentCount"
            glow="#2563EB"
          />
        )}

        {/* Service Correlation Network */}
        <ServiceGraph
          title="Incident Correlation Network"
          dependencies={deps.data ?? []}
          mode="knowledge"
        />
      </Stack>
    </>
  );
}
