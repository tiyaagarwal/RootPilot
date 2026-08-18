import { Grid, Stack } from '@mui/material';
import HubIcon from '@mui/icons-material/Hub';
import { PageHeader } from '../components/common/PageHeader';
import { KpiCard } from '../components/common/KpiCard';
import { SortableTable } from '../components/common/SortableTable';
import { ServiceGraph } from '../components/graphs/ServiceGraph';
import { StatusPill } from '../components/common/StatusPill';
import { usePlatformQuery } from '../hooks/usePlatformQuery';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { dependencyService } from '../services/platformServices';
import { LoadingState } from '../components/feedback/LoadingState';
import { ErrorState } from '../components/feedback/ErrorState';

export function DependencyPage() {
  useDocumentTitle('Dependency Analysis');
  const deps = usePlatformQuery(['deps'], dependencyService.dependencies);
  const summary = usePlatformQuery(['dep-summary'], dependencyService.summary);
  const risks = usePlatformQuery(['dep-risks'], dependencyService.risks);
  const impacts = usePlatformQuery(['dep-impacts'], dependencyService.impacts);
  const impactSummary = usePlatformQuery(['dep-impact-summary'], dependencyService.impactSummary);
  const riskDashboard = usePlatformQuery(['dep-risk-dashboard'], dependencyService.riskDashboard);

  if (deps.isLoading || summary.isLoading) return <LoadingState cards={4} />;
  if (deps.isError) return <ErrorState queryKey={['deps']} title="Dependency Data Unavailable" />;

  const s = summary.data;
  const rd = riskDashboard.data;
  const impS = impactSummary.data;

  return (
    <>
      <PageHeader
        eyebrow="Dependency Analysis"
        title="Blast Radius & Risk Chains"
        description="Full topology of service interdependencies — exposing blast radius, cascade failure paths, and business impact scores for every monitored service pair."
      />
      <Stack spacing={2.5}>
        {/* Dependency summary KPIs */}
        <Grid container spacing={2.2}>
          <Grid item xs={12} md={3}>
            <KpiCard
              label="Total Dependencies"
              value={s?.totalDependencies ?? 0}
              helper={(s?.totalDependencies ?? 0) > 0 ? `Across ${s?.uniqueDependencies ?? 0} unique service pairs` : 'Service dependencies monitored'}
              icon={<HubIcon />}
              accent="#2563EB"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <KpiCard
              label="Unique Pairs"
              value={s?.uniqueDependencies ?? 0}
              helper={s?.topSourceService ?? 'Top source service'}
              accent="#2563EB"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <KpiCard
              label="Peak Dependency Count"
              value={s?.topDependencyCount ?? 0}
              helper={`${s?.topSourceService ?? '—'} → ${s?.topTargetService ?? '—'}`}
              progress={Math.min(100, (s?.topDependencyCount ?? 0) * 6)}
              accent="#D97706"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <KpiCard
              label="Highest Risk Level"
              value={rd?.highestRiskLevel ?? 'N/A'}
              helper={rd?.mostCriticalService ?? 'Risk dashboard'}
              accent="#DC2626"
            />
          </Grid>
        </Grid>

        {/* Impact summary KPIs */}
        {impS && (
          <Grid container spacing={2.2}>
            <Grid item xs={12} md={4}>
              <KpiCard
                label="High Impact Dependencies"
                value={impS.highImpactDependencies ?? 0}
                helper={impactSummary.data?.mostCriticalService ?? 'Highest blast radius service'}
                accent="#DC2626"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <KpiCard
                label="Dependency Health"
                value={rd?.dependencyHealth ?? 'N/A'}
                helper={rd?.executiveRecommendation ?? 'Overall dependency health posture'}
                accent="#2563EB"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <KpiCard
                label="Critical Service"
                value={rd?.mostCriticalService ?? 'N/A'}
                helper={`Avg impact score: ${impactSummary.data?.averageImpactScore ?? 'N/A'}`}
                accent="#2563EB"
              />
            </Grid>
          </Grid>
        )}

        {/* React Flow graph */}
        <ServiceGraph title="Dependency Network Diagram" dependencies={deps.data ?? []} />

        {/* Risk table */}
        <SortableTable
          title="Dependency Risks"
          rows={risks.data ?? deps.data ?? []}
          columns={[
            { key: 'sourceService', label: 'Source' },
            { key: 'targetService', label: 'Target' },
            { key: 'dependencyCount', label: 'Count', numeric: true },
            { key: 'riskLevel', label: 'Risk', renderCell: (v) => v ? <StatusPill value={String(v)} /> : null },
          ]}
          defaultSort="dependencyCount"
        />

        {/* Impact table */}
        {impacts.data && impacts.data.length > 0 && (
          <SortableTable
            title="Dependency Impact Analysis"
            rows={impacts.data}
            columns={[
              { key: 'sourceService', label: 'Source' },
              { key: 'impactedService', label: 'Impacted Service' },
              { key: 'impactLevel', label: 'Impact Level', renderCell: (v) => <StatusPill value={String(v)} /> },
              { key: 'impactScore', label: 'Impact Score', numeric: true },
            ]}
            defaultSort="impactScore"
            glow="#2563EB"
          />
        )}
      </Stack>
    </>
  );
}
