import { Box, Button, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useQueryClient } from '@tanstack/react-query';

interface ErrorStateProps {
  queryKey?: readonly unknown[];
  title?: string;
  description?: string;
  compact?: boolean;
}

export function ErrorState({
  queryKey,
  title = 'Failed to Load Data',
  description = 'The backend did not respond. Check that the Spring Boot service is running.',
  compact = false,
}: ErrorStateProps) {
  const queryClient = useQueryClient();

  const handleRetry = () => {
    if (queryKey) {
      queryClient.invalidateQueries({ queryKey: queryKey as unknown[] });
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        py: compact ? 3 : 6,
        textAlign: 'center',
      }}
    >
      <ErrorOutlineIcon color="error" sx={{ fontSize: compact ? 32 : 44, opacity: 0.7 }} />
      <Typography variant={compact ? 'body2' : 'body1'} fontWeight={700} color="error.main">
        {title}
      </Typography>
      {!compact && (
        <Typography variant="caption" color="text.disabled" sx={{ maxWidth: 380 }}>
          {description}
        </Typography>
      )}
      {queryKey && (
        <Button
          size="small"
          variant="outlined"
          color="error"
          startIcon={<RefreshIcon />}
          onClick={handleRetry}
          sx={{ mt: 0.5, borderRadius: 3 }}
        >
          Retry
        </Button>
      )}
    </Box>
  );
}
