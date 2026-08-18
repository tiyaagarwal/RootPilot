import { useState, useCallback, useEffect } from 'react';
import { Box, Card, CardContent, CardHeader, Typography, TextField, InputAdornment, Chip, Stack, IconButton } from '@mui/material';
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState, type Edge, type Node, MarkerType } from 'reactflow';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import type { ServiceDependency } from '../../types/backend';
import 'reactflow/dist/style.css';

interface ServiceGraphProps {
  title: string;
  dependencies: ServiceDependency[];
  mode?: 'dependency' | 'knowledge' | 'infrastructure';
}

export function ServiceGraph({ title, dependencies, mode = 'dependency' }: ServiceGraphProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [blastRadius, setBlastRadius] = useState<number>(0);

  const unique = Array.from(new Set(dependencies.flatMap((d) => [d.sourceService, d.targetService])));
  const radius = mode === 'knowledge' ? 220 : 190;

  const createNodesAndEdges = useCallback(() => {
    const nodesList: Node[] = unique.map((id, index) => {
      const angle = (index / Math.max(unique.length, 1)) * Math.PI * 2;
      const count = dependencies.filter((d) => d.sourceService === id || d.targetService === id).length;
      return {
        id,
        data: { label: `${id}\n(${count} links)` },
        position: { x: 310 + Math.cos(angle) * radius, y: 210 + Math.sin(angle) * radius },
        style: {
          minWidth: 150,
          borderRadius: 4,
          padding: 10,
          color: '#E2E8F0',
          border: '1px solid #242C3F',
          backgroundColor: '#151C2C',
          whiteSpace: 'pre-line',
          fontWeight: 700,
          fontSize: '11px',
          cursor: 'pointer',
        },
      };
    });

    const edgesList: Edge[] = dependencies.map((d) => ({
      id: `${d.sourceService}-${d.targetService}`,
      source: d.sourceService,
      target: d.targetService,
      label: String(d.dependencyCount),
      animated: d.dependencyCount > 6,
      style: {
        stroke: '#475569',
        strokeWidth: Math.max(1.5, Math.min(5, d.dependencyCount / 3)),
      },
      labelStyle: { fill: '#94A3B8', fontWeight: 700, fontSize: '10px' },
      labelBgStyle: { fill: '#111622', fillOpacity: 0.85 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#475569' },
    }));

    return { nodesList, edgesList };
  }, [dependencies, mode, radius, unique]);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Initialize nodes and edges
  useEffect(() => {
    const { nodesList, edgesList } = createNodesAndEdges();
    setNodes(nodesList);
    setEdges(edgesList);
  }, [dependencies, createNodesAndEdges, setNodes, setEdges]);

  const filteredNodes = searchQuery
    ? nodes.filter((n) => n.id.toLowerCase().includes(searchQuery.toLowerCase()))
    : nodes;

  const filteredEdges = searchQuery
    ? edges.filter((e) =>
        e.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.target.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : edges;

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
    setBlastRadius(1);
  }, []);

  const showBlastRadius = useCallback((radiusVal: number) => {
    setBlastRadius(radiusVal);
    if (selectedNode) {
      const affected = new Set<string>();
      affected.add(selectedNode);

      for (let i = 0; i < radiusVal; i++) {
        const currentLevel = Array.from(affected);
        currentLevel.forEach(nodeId => {
          dependencies.forEach(d => {
            if (d.sourceService === nodeId) affected.add(d.targetService);
            if (d.targetService === nodeId) affected.add(d.sourceService);
          });
        });
      }

      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          style: {
            ...n.style,
            border: selectedNode === n.id
              ? '2px solid #F59E0B' // Selected
              : affected.has(n.id)
              ? '2px solid #EF4444' // Downstream blast
              : '1px solid #242C3F',
            opacity: affected.has(n.id) || selectedNode === n.id ? 1 : 0.25,
          },
        }))
      );

      setEdges((eds) =>
        eds.map((e) => ({
          ...e,
          style: {
            ...e.style,
            opacity: affected.has(e.source) && affected.has(e.target) ? 1 : 0.15,
            stroke: affected.has(e.source) && affected.has(e.target) ? '#EF4444' : '#475569',
            strokeWidth: affected.has(e.source) && affected.has(e.target) ? 3 : 1.5,
          },
        }))
      );
    }
  }, [selectedNode, dependencies, setNodes, setEdges]);

  const resetBlastRadius = useCallback(() => {
    setBlastRadius(0);
    setSelectedNode(null);
    const { nodesList, edgesList } = createNodesAndEdges();
    setNodes(nodesList);
    setEdges(edgesList);
  }, [createNodesAndEdges, setNodes, setEdges]);

  return (
    <Card>
      <CardHeader
        title={title}
        action={
          selectedNode && (
            <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
              <Chip
                label={`Blast Radius: ${blastRadius}`}
                size="small"
                color="warning"
                onClick={() => showBlastRadius(blastRadius + 1)}
                sx={{ cursor: 'pointer', borderRadius: 0.5 }}
              />
              <Chip
                label="Reset"
                size="small"
                onClick={resetBlastRadius}
                sx={{ cursor: 'pointer', borderRadius: 0.5 }}
              />
            </Stack>
          )
        }
      />
      <CardContent>
        <TextField
          fullWidth
          placeholder="Search service node..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchQuery('')}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 1.5 }}
        />

        {selectedNode && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Selected node: <strong>{selectedNode}</strong> · Click to highlight dependencies · Increase Blast Radius to trace cascades.
            </Typography>
          </Box>
        )}

        <Box sx={{ height: 400, border: '1px solid #242C3F', backgroundColor: '#0B0E14', borderRadius: 0.5, overflow: 'hidden' }}>
          <ReactFlow
            nodes={filteredNodes}
            edges={filteredEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={handleNodeClick}
            fitView
            proOptions={{ hideAttribution: true }}
          >
            <MiniMap
              pannable
              zoomable
              nodeColor={() => '#151C2C'}
              maskColor="rgba(11, 14, 20, 0.8)"
            />
            <Background color="#1E293B" gap={16} size={1} />
            <Controls />
          </ReactFlow>
        </Box>
      </CardContent>
    </Card>
  );
}
