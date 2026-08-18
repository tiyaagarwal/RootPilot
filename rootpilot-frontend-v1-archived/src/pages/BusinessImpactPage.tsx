import { Grid, Stack, Typography, CardContent, Divider, Box, Chip } from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { PageHeader } from '../components/common/PageHeader';
import { KpiCard } from '../components/common/KpiCard';
import { SortableTable } from '../components/common/SortableTable';
import { StatusPill } from '../components/common/StatusPill';
import { GlassCard } from '../components/common/GlassCard';
import { usePlatformQuery } from '../hooks/usePlatformQuery';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { businessServiceService } from '../services/platformServices';
import { LoadingState } from '../components/feedback/LoadingState';
import { ErrorState } from '../components/feedback/ErrorState';

export function BusinessImpactPage() {
  useDocumentTitle('Business Impact');

  const businessServices = usePlatformQuery(['business-services-list'], businessServiceService.list);
  const businessImpact = usePlatformQuery(['business-services-impact'], businessServiceService.impact);

  if (businessServices.isLoading || businessImpact.isLoading) {
    return <LoadingState cards={4} />;
  }

  if (businessServices.isError || businessImpact.isError) {
    return <ErrorState queryKey={['business-services-list']} title="Business Service Impact Offline" />;
  }

  const bServices = businessServices.data ?? [];
  const impact = businessImpact.data;

  // Render tech dependencies helper helper text based on service name
  const getTechDeps = (name: string) => {
    switch (name) {
      case "Checkout Experience":
        return ["payment-service", "redis-service", "database-service"];
      case "User Authentication":
        return ["auth-service", "postgres-service"];
      case "Order Processing":
        return ["inventory-service", "rabbitmq-broker", "shipping-service"];
      case "Customer Onboarding":
        return ["frontend-service", "portal-api", "email-service"];
      default:
        return ["unknown-service"];
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Business Impact"
        title="Business-Critical Service Impact Analysis"
        description="Traverse from technical component outages (Postgres, RabbitMQ, Spring Boot) to executive revenue risk. Map technical dependencies to customer experiences."
      />
      <Stack spacing={2.5}>
        {/* executive metrics */}
        <Grid container spacing={2.2}>
          <Grid item xs={12} md={4}>
            <GlassCard glow="#EF4444">
              <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: '50%', bgcolor: 'rgba(239,68,68,0.1)' }}>
                  <MonetizationOnIcon sx={{ fontSize: 32, color: '#EF4444' }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Total Revenue at Risk</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#EF4444' }}>
                    ${impact?.totalEstimatedLoss?.toLocaleString() ?? '0'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Estimated loss for current downtime</Typography>
                </Box>
              </CardContent>
            </GlassCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <KpiCard
              label="Down Business Flows"
              value={impact?.downServices ?? 0}
              helper="Requiring immediate executive escalation"
              icon={<ErrorOutlineIcon />}
              accent="#EF4444"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <KpiCard
              label="Degraded Business Flows"
              value={impact?.degradedServices ?? 0}
              helper="Suffering latency or partial failure"
              icon={<BusinessCenterIcon />}
              accent="#F59E0B"
            />
          </Grid>
        </Grid>

        {/* Business Service Maps Grid */}
        <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>Business Services Mapping</Typography>
        <Grid container spacing={2.2}>
          {bServices.map((service) => (
            <Grid item xs={12} md={6} key={service.id}>
              <GlassCard glow={service.healthStatus === 'DOWN' ? '#EF4444' : service.healthStatus === 'DEGRADED' ? '#F59E0B' : '#10B981'}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">{service.name}</Typography>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                        Owner: {service.owner}
                      </Typography>
                    </Box>
                    <Chip
                      label={service.healthStatus}
                      color={service.healthStatus === 'HEALTHY' ? 'success' : service.healthStatus === 'DEGRADED' ? 'warning' : 'error'}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40, mb: 2 }}>
                    {service.description}
                  </Typography>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Financial Risk Exposure:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      ${service.revenueRiskPerHour?.toLocaleString()} / hour
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 'bold' }}>
                      Discovered Technical Dependencies:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {getTechDeps(service.name).map((tech) => (
                        <Chip
                          key={tech}
                          label={tech}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </GlassCard>
            </Grid>
          ))}
        </Grid>

        {/* Business Impact Details table */}
        <SortableTable
          title="Active Financial Impact Incidents"
          rows={impact?.impactedDetails ?? []}
          columns={[
            { key: 'businessService', label: 'Business Service' },
            { key: 'status', label: 'Downtime Status', renderCell: (v) => <StatusPill value={String(v)} /> },
            { key: 'revenueLoss', label: 'Estimated Revenue Loss', numeric: true, renderCell: (v) => `$${Number(v).toLocaleString()}` },
            { key: 'owner', label: 'Escalation Owner' },
          ]}
          defaultSort="revenueLoss"
        />
      </Stack>
    </>
  );
}
