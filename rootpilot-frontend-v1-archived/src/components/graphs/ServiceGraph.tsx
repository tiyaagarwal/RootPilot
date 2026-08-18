import { Box, CardContent, Typography } from '@mui/material';
import ReactFlow, { Background, Controls, MiniMap, type Edge, type Node } from 'reactflow';
import type { ServiceDependency } from '../../types/backend';
import { GlassCard } from '../common/GlassCard';

export function ServiceGraph({ title, dependencies, mode = 'dependency' }: { title: string; dependencies: ServiceDependency[]; mode?: 'dependency' | 'knowledge' }) {
  const unique = Array.from(new Set(dependencies.flatMap((d) => [d.sourceService, d.targetService])));
  const radius = mode === 'knowledge' ? 220 : 190;
  const nodes: Node[] = unique.map((id, index) => {
    const angle = (index / Math.max(unique.length, 1)) * Math.PI * 2;
    const count = dependencies.filter((d) => d.sourceService === id || d.targetService === id).length;
    return { id, data: { label: `${id}\n${count} links` }, position: { x: 310 + Math.cos(angle) * radius, y: 210 + Math.sin(angle) * radius }, style: { minWidth: 158, borderRadius: 18, padding: 14, color: '#eef6ff', border: `1px solid ${mode === 'knowledge' ? '#8b5cf6' : '#38bdf8'}`, background: mode === 'knowledge' ? 'linear-gradient(145deg,#1e1b4b,#0f172a)' : 'linear-gradient(145deg,#082f49,#0f172a)', boxShadow: '0 20px 40px rgba(0,0,0,.28)', whiteSpace: 'pre-line', fontWeight: 800 } };
  });
  const edges: Edge[] = dependencies.map((d) => ({ id: `${d.sourceService}-${d.targetService}`, source: d.sourceService, target: d.targetService, label: String(d.dependencyCount), animated: d.dependencyCount > 6, style: { stroke: mode === 'knowledge' ? '#a78bfa' : '#38bdf8', strokeWidth: Math.max(2, Math.min(6, d.dependencyCount / 3)) }, labelStyle: { fill: '#e2e8f0', fontWeight: 800 }, labelBgStyle: { fill: '#0f172a', fillOpacity: .86 } }));
  return <GlassCard glow={mode === 'knowledge' ? '#8b5cf6' : '#38bdf8'}><CardContent><Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography><Box sx={{ height: { xs: 420, md: 560 }, borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(148,163,184,.12)', bgcolor: 'rgba(2,6,23,.44)' }}><ReactFlow nodes={nodes} edges={edges} fitView proOptions={{ hideAttribution: true }}><MiniMap pannable zoomable nodeColor={() => mode === 'knowledge' ? '#8b5cf6' : '#38bdf8'} maskColor="rgba(2,6,23,.72)" /><Background color="#334155" gap={20} /><Controls /></ReactFlow></Box></CardContent></GlassCard>;
}
