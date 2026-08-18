import { useState, useRef, useEffect } from 'react';
import {
  Box, Fab, Slide, Paper, Stack, Typography,
  IconButton, InputBase, Divider, Avatar, CircularProgress, Tooltip, Chip,
} from '@mui/material';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { copilotService } from '../../services/platformServices';
import type { CopilotResponse } from '../../types/backend';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  copilotResponse?: CopilotResponse;
}

const CONFIDENCE_COLORS = {
  DATA_BACKED: '#22c55e',
  PARTIAL:     '#f59e0b',
  GUIDE_ONLY:  '#6b7280',
};

const CONFIDENCE_LABELS = {
  DATA_BACKED: '✅ Data Backed',
  PARTIAL:     '⚡ Partial Data',
  GUIDE_ONLY:  '📖 Guide',
};

const SUGGESTIONS = [
  'Why is the platform at risk?',
  'Are there any anomalies detected?',
  'What\'s the forecast for high-risk services?',
  'Show today\'s operational health',
];

export function AskRootPilot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Hello! I'm the Operations Copilot. Ask me about incidents, service risk, anomalies, changes, or business impact. My answers are composed from real platform data.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [messages, open]);

  const sendMessage = async (text: string = input.trim()) => {
    if (!text || loading) return;
    setInput('');

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // Extract @mention as service context
      let serviceName: string | undefined;
      const mentionMatch = text.match(/@([\w-]+)/);
      if (mentionMatch) serviceName = mentionMatch[1];

      const result = await copilotService.ask({ question: text, serviceName });

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.answer,
        timestamp: new Date(),
        copilotResponse: result,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm unable to reach the backend. Please ensure RootPilot's API server is running.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <Typography key={i} variant="body2" sx={{ lineHeight: 1.65, mb: line === '' ? 0.5 : 0 }}>
          {parts.map((part, j) =>
            j % 2 === 1 ? (
              <Box component="span" key={j} sx={{ fontWeight: 700, color: 'primary.main' }}>
                {part}
              </Box>
            ) : part,
          )}
        </Typography>
      );
    });
  };

  return (
    <>
      {/* Floating Action Button */}
      <Box sx={{ position: 'fixed', bottom: 28, right: 28, zIndex: 1400 }}>
        <motion.div
          animate={open ? {} : { scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Tooltip title={open ? 'Close Operations Copilot' : 'Operations Copilot'} placement="left">
            <Fab
              color="primary"
              id="operations-copilot-fab"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? 'Close Operations Copilot' : 'Open Operations Copilot'}
              sx={{
                background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                boxShadow: '0 8px 24px rgba(99,102,241,0.45)',
                '&:hover': { background: 'linear-gradient(135deg, #2563EB, #4F46E5)' },
              }}
            >
              <AnimatePresence mode="wait">
                {open ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <CloseIcon />
                  </motion.div>
                ) : (
                  <motion.div key="ai" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <PsychologyAltIcon />
                  </motion.div>
                )}
              </AnimatePresence>
            </Fab>
          </Tooltip>
        </motion.div>
      </Box>

      {/* Chat Panel */}
      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Paper
          elevation={0}
          sx={{
            position: 'fixed',
            bottom: 96,
            right: 28,
            width: { xs: 'calc(100vw - 56px)', sm: 440 },
            height: 580,
            zIndex: 1399,
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
          }}
        >
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{
            px: 2.5, py: 1.8,
            background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
            color: '#fff', flexShrink: 0,
          }}>
            <AutoAwesomeIcon fontSize="small" />
            <Box flex={1}>
              <Typography variant="subtitle2" fontWeight={700} color="inherit">
                Operations Copilot
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }} color="inherit">
                Deterministic intelligence — all answers are data-traced
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: 'rgba(255,255,255,0.8)' }} aria-label="Close copilot">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Divider />

          {/* Messages */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {messages.map((msg) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                <Stack direction={msg.role === 'user' ? 'row-reverse' : 'row'} spacing={1} alignItems="flex-start">
                  <Avatar sx={{
                    width: 28, height: 28, fontSize: 12, fontWeight: 700, flexShrink: 0,
                    background: msg.role === 'assistant'
                      ? 'linear-gradient(135deg, #3B82F6, #6366F1)'
                      : undefined,
                    bgcolor: msg.role === 'assistant' ? undefined : 'secondary.main',
                  }}>
                    {msg.role === 'assistant' ? <AutoAwesomeIcon sx={{ fontSize: 14 }} /> : 'U'}
                  </Avatar>

                  <Box sx={{ maxWidth: '82%' }}>
                    <Box sx={{
                      px: 1.75, py: 1.25,
                      borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                      bgcolor: msg.role === 'user' ? 'primary.main' : 'action.hover',
                      color: msg.role === 'user' ? '#fff' : 'text.primary',
                      border: msg.role !== 'user' ? '1px solid' : 'none',
                      borderColor: 'divider',
                    }}>
                      {msg.role === 'user'
                        ? <Typography variant="body2" sx={{ lineHeight: 1.65 }}>{msg.content}</Typography>
                        : formatContent(msg.content)
                      }
                      <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.6, fontSize: '0.65rem', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>

                    {/* Copilot: confidence badge + action links */}
                    {msg.copilotResponse && (
                      <Box sx={{ mt: 0.75, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        <Chip
                          label={CONFIDENCE_LABELS[msg.copilotResponse.confidence]}
                          size="small"
                          sx={{
                            fontSize: '0.65rem', height: 20,
                            bgcolor: CONFIDENCE_COLORS[msg.copilotResponse.confidence] + '22',
                            color: CONFIDENCE_COLORS[msg.copilotResponse.confidence],
                            border: `1px solid ${CONFIDENCE_COLORS[msg.copilotResponse.confidence]}44`,
                          }}
                        />
                        {msg.copilotResponse.actionLinks?.map(link => (
                          <Chip
                            key={link.route}
                            label={link.label + ' →'}
                            size="small"
                            onClick={() => { navigate(link.route); setOpen(false); }}
                            sx={{
                              cursor: 'pointer', fontSize: '0.65rem', height: 20,
                              '&:hover': { bgcolor: 'primary.main', color: '#fff' },
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                </Stack>
              </motion.div>
            ))}

            {loading && (
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar sx={{ width: 28, height: 28, background: 'linear-gradient(135deg, #3B82F6, #6366F1)' }}>
                  <AutoAwesomeIcon sx={{ fontSize: 14 }} />
                </Avatar>
                <Box sx={{ px: 2, py: 1.25, borderRadius: '12px 12px 12px 2px', bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }}>
                  <CircularProgress size={14} />
                </Box>
              </Stack>
            )}

            <div ref={bottomRef} />
          </Box>

          {/* Suggestions */}
          {messages.length === 1 && (
            <Box sx={{ px: 2, pb: 1, display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {SUGGESTIONS.map((s) => (
                <Chip key={s} label={s} size="small" variant="outlined" onClick={() => sendMessage(s)}
                  sx={{ cursor: 'pointer', fontSize: '0.72rem', '&:hover': { bgcolor: 'primary.main', color: '#fff', borderColor: 'primary.main' }, transition: 'all 0.15s ease' }}
                />
              ))}
            </Box>
          )}

          <Divider />

          {/* Input */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 2, py: 1.25, bgcolor: 'background.paper', flexShrink: 0 }}>
            <InputBase
              id="copilot-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Ask about services, incidents, risk… use @service-name"
              multiline
              maxRows={3}
              sx={{ flex: 1, fontSize: 13 }}
              disabled={loading}
              inputProps={{ 'aria-label': 'Ask Operations Copilot' }}
            />
            <Tooltip title="Send (Enter)">
              <span>
                <IconButton size="small" onClick={() => sendMessage()} disabled={!input.trim() || loading}
                  aria-label="Send message"
                  sx={{
                    bgcolor: 'primary.main', color: '#fff',
                    '&:hover': { bgcolor: 'primary.dark' },
                    '&.Mui-disabled': { bgcolor: 'action.disabledBackground' },
                  }}>
                  <SendIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </Paper>
      </Slide>
    </>
  );
}
