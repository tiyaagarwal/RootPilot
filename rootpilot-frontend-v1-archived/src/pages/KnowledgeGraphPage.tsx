import { Grid, Stack, Typography } from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { PageHeader } from '../components/common/PageHeader';
import { KpiCard } from '../components/common/KpiCard';
import { SortableTable } from '../components/common/SortableTable';
import { ServiceGraph } from '../components/graphs/ServiceGraph';
import { GlassCard } from '../components/common/GlassCard';
import { CardContent } from '@mui/material';
import { usePlatformQuery } from '../hooks/usePlatformQuery';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { knowledgeGraphService, dependencyService } from '../services/platformServices';
import { LoadingState } from '../components/feedback/LoadingState';
import { ErrorState } from '../components/feedback/ErrorState';

export function KnowledgeGraphPage() {
  useDocumentTitle('Knowledge Graph');
  const summary = usePlatformQuery(['kg-summary'], knowledgeGraphService.summary);
  const execSummary = usePlatformQuery(['kg-exec-summary'], knowledgeGraphService.executiveSummary);
  const deps = usePlatformQuery(['kg-deps'], dependencyService.dependencies);

  if (summary.isLoading) return <LoadingState cards={4} />;
  if (summary.isError) return <ErrorState queryKey={['kg-summary']} title="Knowledge Graph Unavailable" />;

  const s = summary.data;

  return (
    <>
      <PageHeader
        eyebrow="Knowledge Graph"
        title="Service Relationship Graph"
        description="Interactive visualization of all service relationships, dependencies, and incident clusters — powered by AI graph intelligence."
      />
      <Stack spacing={2.5}>
        {/* Core KPIs */}
        <Grid container spacing={2.2}>
          <Grid item xs={12} md={3}>
            <KpiCard
              label="Graph Health"
              value={s?.graphHealthScore ?? 0}
              suffix="%"
              helper={`Most connected: ${s?.mostConnectedNode ?? 'N/A'}`}
              progress={s?.graphHealthScore}
              icon={<AccountTreeIcon />}
              accent="#2563EB"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <KpiCard
              label="Total Nodes"
              value={s?.totalNodes ?? 0}
              helper="Service nodes in the graph"
              accent="#2563EB"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <KpiCard
              label="Relationships"
              value={s?.totalRelationships ?? 0}
              helper={s?.strongestRelationship ?? 'Service linkages'}
              accent="#2563EB"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <KpiCard
              label="Incident Clusters"
              value={s?.incidentClusters ?? 0}
              helper={`Most common exception: ${s?.mostCommonException ?? 'N/A'}`}
              accent="#D97706"
            />
          </Grid>
        </Grid>

        {/* Extended metrics */}
        <Grid container spacing={2.2}>
          <Grid item xs={12} md={4}>
            <KpiCard
              label="Graph Maturity"
              value={s?.graphMaturityScore ?? 0}
              suffix="%"
              helper="Structural completeness score"
              progress={s?.graphMaturityScore}
              accent="#2563EB"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <KpiCard
              label="Relationship Diversity"
              value={s?.relationshipDiversityScore ?? 0}
              suffix="%"
              helper="Link type spread"
              progress={s?.relationshipDiversityScore}
              accent="#2563EB"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <KpiCard
              label="Graph Density"
              value={s?.graphDensity !== undefined ? (s.graphDensity * 100).toFixed(1) : 'N/A'}
              suffix={s?.graphDensity !== undefined ? '%' : undefined}
              helper="Edge to node ratio"
              accent="#2563EB"
            />
          </Grid>
        </Grid>

        {!execSummary.isError && execSummary.data && (
          <GlassCard glow="#2563EB">
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Executive Summary</Typography>
              <Typography color="text.secondary" variant="body2">
                <strong>Graph Health:</strong> {execSummary.data.graphHealth}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                <strong>Most Influential Node:</strong> {execSummary.data.mostInfluentialNode}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                <strong>Critical Relationship:</strong> {execSummary.data.criticalRelationship}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                <strong>Relationship Risk Level:</strong> {execSummary.data.relationshipRiskLevel}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                <strong>Executive Recommendation:</strong> {execSummary.data.executiveRecommendation}
              </Typography>
            </CardContent>
          </GlassCard>
        )}

        {/* Interactive graph */}
        <ServiceGraph
          title="Interactive Knowledge Graph"
          dependencies={deps.data ?? []}
          mode="knowledge"
        />

        {/* Dependency table */}
        <SortableTable
          title="Service Dependencies"
          rows={deps.data ?? []}
          columns={[
            { key: 'sourceService', label: 'Source' },
            { key: 'targetService', label: 'Target' },
            { key: 'dependencyCount', label: 'Link Count', numeric: true },
          ]}
          defaultSort="dependencyCount"
          glow="#2563EB"
        />
      </Stack>
    </>
  );
}
