import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  TextField,
  Button,
  Stack,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SendIcon from '@mui/icons-material/Send';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RefreshIcon from '@mui/icons-material/Refresh';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import StorageIcon from '@mui/icons-material/Storage';
import { useNavigate } from 'react-router-dom';
import { copilotService } from '../../services/platformServices';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  confidence?: 'DATA_BACKED' | 'PARTIAL' | 'GUIDE_ONLY';
  dataSources?: string[];
  actionLinks?: Array<{ label: string; route: string }>;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | string;
  recommendations?: string[];
  affectedServices?: string[];
}

interface CopilotDrawerProps {
  open: boolean;
  onClose: () => void;
  contextType?: 'incident' | 'service' | 'infrastructure' | 'general';
  contextId?: string | number;
  contextName?: string;
}

export function CopilotDrawer({ open, onClose, contextType = 'general', contextId, contextName }: CopilotDrawerProps) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [connError, setConnError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) {
      setConnError(false);
      let welcomeText = "Hello! I am your Operations Copilot. How can I help you triage the platform today?";
      if (contextType === 'incident' && contextId) {
        welcomeText = `I see you are viewing Incident #${contextId} (${contextName || 'unknown exception'}). I can analyze the correlated deployment change log, map downstream services in the blast radius, or recommend corrective actions. What would you like to know?`;
      } else if (contextType === 'service' && contextName) {
        welcomeText = `I am loaded with the reliability context of ${contextName}. I can explain its availability status, details on its dependencies, or help diagnose recent violations. Ask me anything about this service.`;
      } else if (contextType === 'infrastructure' && contextName) {
        welcomeText = `Viewing host inventory: ${contextName}. Ask me to review CPU metrics, disk saturation, or list active microservices running on this instance.`;
      }

      setMessages([
        {
          id: 'welcome',
          sender: 'assistant',
          text: welcomeText,
          timestamp: new Date(),
        },
      ]);
    }
  }, [open, contextType, contextId, contextName]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || query;
    if (!text.trim() || loading) return;

    if (!textToSend) setQuery('');
    setConnError(false);

    const userMessage: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await copilotService.ask({
        question: text,
        serviceName: contextType === 'service' ? contextName : undefined,
        incidentId: contextType === 'incident' && typeof contextId === 'number' ? contextId : undefined,
      });

      const assistantMessage: Message = {
        id: Math.random().toString(),
        sender: 'assistant',
        text: response.answer,
        timestamp: new Date(),
        confidence: response.confidenceScore > 0.85 ? 'DATA_BACKED' : 'PARTIAL',
        dataSources: response.dataSources,
        actionLinks: response.actionLinks,
        riskLevel: response.riskLevel,
        recommendations: response.recommendations,
        affectedServices: response.affectedServices,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setConnError(true);
    } finally {
      setLoading(false);
    }
  };

  const getSuggestedPrompts = () => {
    switch (contextType) {
      case 'incident':
        return [
          'What likely caused this incident?',
          'What is the blast radius?',
          'Suggest remediation actions.',
        ];
      case 'service':
        return [
          `Analyze reliability risks for ${contextName}`,
          `List dependencies of ${contextName}`,
          'Check SLO compliance violations.',
        ];
      case 'infrastructure':
        return [
          'Analyze resource saturation details.',
          'What microservices run here?',
        ];
      default:
        return [
          'Give me today\'s operational briefing.',
          'Summarize active incidents.',
          'Are there any predicted failure risks?',
        ];
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 480 },
          backgroundColor: 'background.paper',
          borderLeft: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider', backgroundColor: 'background.default' }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <SmartToyIcon color="primary" />
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>Operations Copilot</Typography>
            {contextName && (
              <Typography variant="caption" color="text.secondary">
                Context: {contextType} • {contextName}
              </Typography>
            )}
          </Box>
        </Stack>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Messages */}
      <Box sx={{ flex: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              width: '90%',
            }}
          >
            <Paper
              sx={{
                p: 2,
                backgroundColor: msg.sender === 'user' ? 'rgba(59, 130, 246, 0.04)' : 'background.default',
                border: '1px solid',
                borderColor: msg.sender === 'user' ? 'primary.main' : 'divider',
                borderRadius: 1.5,
              }}
            >
              {/* Risk Level Badge */}
              {msg.riskLevel && (
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Chip
                    label={`RISK: ${msg.riskLevel}`}
                    size="small"
                    sx={{
                      height: 16,
                      fontSize: '8px',
                      fontWeight: 800,
                      backgroundColor: msg.riskLevel === 'HIGH' || msg.riskLevel === 'CRITICAL' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      color: msg.riskLevel === 'HIGH' || msg.riskLevel === 'CRITICAL' ? '#EF4444' : '#10B981',
                    }}
                  />
                  {msg.confidence && (
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '9px', fontWeight: 700 }}>
                      Confidence Score: 95%
                    </Typography>
                  )}
                </Stack>
              )}

              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: 'text.primary', fontSize: '0.8rem' }}>
                {msg.text}
              </Typography>

              {/* Affected Services */}
              {msg.affectedServices && msg.affectedServices.length > 0 && (
                <Box sx={{ mt: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 700, fontSize: '9px' }}>
                    Affected Components:
                  </Typography>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap">
                    {msg.affectedServices.map((service, idx) => (
                      <Chip
                        key={idx}
                        label={service}
                        size="small"
                        sx={{ fontSize: '9px', height: 16, backgroundColor: 'rgba(239, 68, 68, 0.05)', color: '#EF4444' }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Data Sources */}
              {msg.dataSources && msg.dataSources.length > 0 && (
                <Box sx={{ mt: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 700, fontSize: '9px' }}>
                    Evidence Sources:
                  </Typography>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ gap: 0.5 }}>
                    {msg.dataSources.map((ds, idx) => (
                      <Chip
                        key={idx}
                        icon={<StorageIcon sx={{ fontSize: '10px !important' }} />}
                        label={ds}
                        size="small"
                        sx={{ fontSize: '8px', height: 16, backgroundColor: 'background.paper', borderColor: 'divider', border: '1px solid' }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Recommended Action Cards */}
              {msg.recommendations && msg.recommendations.length > 0 && (
                <Box sx={{ mt: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 700, fontSize: '9px' }}>
                    Recommended Action Items:
                  </Typography>
                  <Stack spacing={0.5}>
                    {msg.recommendations.map((rec, idx) => (
                      <Box key={idx} sx={{ p: 1, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 0.5 }}>
                        <Typography variant="caption" color="text.primary" sx={{ display: 'block', fontWeight: 650, fontSize: '10px' }}>
                          {idx + 1}. {rec}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Action Links */}
              {msg.actionLinks && msg.actionLinks.length > 0 && (
                <Box sx={{ mt: 1.5, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {msg.actionLinks.map((link, idx) => (
                    <Button
                      key={idx}
                      variant="outlined"
                      size="small"
                      endIcon={<OpenInNewIcon sx={{ fontSize: 10 }} />}
                      onClick={() => {
                        onClose();
                        navigate(link.route);
                      }}
                      sx={{ fontSize: '9px', py: 0.2, px: 0.8, borderColor: 'primary.main', color: 'primary.main' }}
                    >
                      {link.label}
                    </Button>
                  ))}
                </Box>
              )}
            </Paper>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5, px: 0.5, justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              <Typography variant="caption" color="text.disabled" sx={{ fontSize: '9px' }}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Stack>
          </Box>
        ))}

        {/* Dynamic Connection Failure Box */}
        {connError && (
          <Alert
            severity="warning"
            icon={<WarningAmberIcon sx={{ fontSize: 18 }} />}
            action={
              <Button color="inherit" size="small" startIcon={<RefreshIcon />} onClick={() => handleSend()}>
                Retry
              </Button>
            }
            sx={{
              backgroundColor: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              color: '#F59E0B',
              fontSize: '11px',
              '& .MuiAlert-icon': { color: '#F59E0B' },
            }}
          >
            Operational intelligence is temporarily unavailable.
          </Alert>
        )}

        {loading && (
          <Box sx={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={14} />
            <Typography variant="caption" color="text.secondary">Copilot is resolving signals...</Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Suggested Prompts */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', backgroundColor: 'background.default' }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 700 }}>
          Suggested Inquiries:
        </Typography>
        <Stack spacing={0.75}>
          {getSuggestedPrompts().map((p, idx) => (
            <Button
              key={idx}
              variant="outlined"
              size="small"
              onClick={() => handleSend(p)}
              disabled={loading}
              sx={{
                justifyContent: 'flex-start',
                textAlign: 'left',
                borderColor: 'divider',
                color: 'text.primary',
                fontSize: '11px',
                py: 0.5,
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(59, 130, 246, 0.05)',
                },
              }}
            >
              {p}
            </Button>
          ))}
        </Stack>
      </Box>

      {/* Input */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', backgroundColor: 'background.default' }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <Stack direction="row" spacing={1}>
            <TextField
              fullWidth
              placeholder="Ask a question..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
              autoComplete="off"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'background.paper',
                },
              }}
            />
            <IconButton
              type="submit"
              color="primary"
              disabled={loading || !query.trim()}
              sx={{
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                },
              }}
            >
              <SendIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Stack>
        </form>
      </Box>
    </Drawer>
  );
}
