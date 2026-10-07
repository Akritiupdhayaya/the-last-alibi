import React, { useState, useRef, useEffect } from 'react';
import { BoardNode, BoardConnection, CaseDefinition } from '../../types/case';
import { soundFx } from '../../services/soundFx';
import { Pin, Plus, Trash2, Link2, Sparkles, Move, X } from 'lucide-react';

interface InvestigationBoardProps {
  caseDef: CaseDefinition;
  nodes: BoardNode[];
  connections: BoardConnection[];
  onUpdateNodes: (nodes: BoardNode[]) => void;
  onUpdateConnections: (connections: BoardConnection[]) => void;
}

export const InvestigationBoard: React.FC<InvestigationBoardProps> = ({
  caseDef,
  nodes,
  connections,
  onUpdateNodes,
  onUpdateConnections,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const boardRef = useRef<HTMLDivElement | null>(null);

  // Initialize with starter nodes if board is empty
  useEffect(() => {
    if (nodes.length === 0) {
      const defaultNodes: BoardNode[] = [
        {
          id: 'node-victim',
          type: 'SUSPECT',
          title: 'Elias Blackwood',
          subtitle: 'Victim · Study (10:22 PM)',
          x: 440,
          y: 70,
          color: '#e24a4a',
          referenceId: 'victim',
        },
        {
          id: 'node-clara',
          type: 'SUSPECT',
          title: 'Clara Blackwood',
          subtitle: 'Daughter · Claims Kitchen Tea',
          x: 180,
          y: 200,
          color: '#c5a880',
          referenceId: 'suspect-clara',
        },
        {
          id: 'node-adrian',
          type: 'SUSPECT',
          title: 'Adrian Vale',
          subtitle: 'Partner · Fled Argument',
          x: 720,
          y: 200,
          color: '#8b9bb4',
          referenceId: 'suspect-adrian',
        },
        {
          id: 'node-kettle',
          type: 'EVIDENCE',
          title: 'Cold Electric Kettle',
          subtitle: 'Kitchen · Unboiled (17.8°C)',
          x: 140,
          y: 380,
          color: '#ef4444',
          referenceId: 'evidence-cold-kettle',
        },
        {
          id: 'node-weapon',
          type: 'EVIDENCE',
          title: 'Bronze Horse Statuette',
          subtitle: 'Study · Cashmere Microfibers',
          x: 440,
          y: 320,
          color: '#d97706',
          referenceId: 'evidence-bronze-horse',
        },
        {
          id: 'node-clock',
          type: 'EVENT',
          title: 'Clock Stopped at 10:22 PM',
          subtitle: 'Fixed Fatal Timestamp',
          x: 440,
          y: 470,
          color: '#10b981',
          referenceId: 'evidence-mantle-clock',
        },
      ];

      const defaultConnections: BoardConnection[] = [
        {
          id: 'conn-1',
          fromId: 'node-clara',
          toId: 'node-kettle',
          label: 'CONTRADICTION',
          color: '#ef4444',
        },
        {
          id: 'conn-2',
          fromId: 'node-victim',
          toId: 'node-weapon',
          label: 'WEAPON LINK',
          color: '#d97706',
        },
        {
          id: 'conn-3',
          fromId: 'node-clara',
          toId: 'node-weapon',
          label: 'SUSPICION',
          color: '#c5a880',
        },
      ];

      onUpdateNodes(defaultNodes);
      onUpdateConnections(defaultConnections);
    }
  }, [nodes.length, onUpdateNodes, onUpdateConnections]);

  // Handle Dragging
  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playPin();
    const node = nodes.find((n) => n.id === nodeId);
    if (!node || !boardRef.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    setDraggingNodeId(nodeId);
    setDragOffset({
      x: e.clientX - boardRect.left - node.x,
      y: e.clientY - boardRect.top - node.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNodeId || !boardRef.current) return;
    const boardRect = boardRef.current.getBoundingClientRect();
    const newX = Math.max(20, Math.min(boardRect.width - 200, e.clientX - boardRect.left - dragOffset.x));
    const newY = Math.max(20, Math.min(boardRect.height - 100, e.clientY - boardRect.top - dragOffset.y));

    onUpdateNodes(
      nodes.map((n) => (n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n))
    );
  };

  const handleMouseUp = () => {
    if (draggingNodeId) {
      setDraggingNodeId(null);
    }
  };

  // Connecting Logic
  const handleStartConnect = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playPin();
    if (!connectingFromId) {
      setConnectingFromId(nodeId);
    } else if (connectingFromId === nodeId) {
      setConnectingFromId(null);
    } else {
      // Create new connection
      const newConn: BoardConnection = {
        id: `conn-${Date.now()}`,
        fromId: connectingFromId,
        toId: nodeId,
        label: 'CONTRADICTION',
        color: '#c5a880',
      };
      onUpdateConnections([...connections, newConn]);
      setConnectingFromId(null);
    }
  };

  const handleDeleteNode = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playPaper();
    onUpdateNodes(nodes.filter((n) => n.id !== nodeId));
    onUpdateConnections(
      connections.filter((c) => c.fromId !== nodeId && c.toId !== nodeId)
    );
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  };

  const handleDeleteConnection = (connId: string) => {
    soundFx.playPaper();
    onUpdateConnections(connections.filter((c) => c.id !== connId));
  };

  const handleChangeConnLabel = (connId: string) => {
    soundFx.playPin();
    const labels: BoardConnection['label'][] = [
      'CONTRADICTION',
      'ALIBI CLAIM',
      'WEAPON LINK',
      'MOTIVE',
      'SUSPECT',
      'SUSPICION',
    ];
    const colors: Record<BoardConnection['label'], string> = {
      CONTRADICTION: '#ef4444',
      'ALIBI CLAIM': '#3b82f6',
      'WEAPON LINK': '#d97706',
      MOTIVE: '#a855f7',
      SUSPECT: '#c5a880',
      SUSPICION: '#eab308',
    };

    onUpdateConnections(
      connections.map((c) => {
        if (c.id === connId) {
          const nextIdx = (labels.indexOf(c.label) + 1) % labels.length;
          const nextLabel = labels[nextIdx];
          return {
            ...c,
            label: nextLabel,
            color: colors[nextLabel],
          };
        }
        return c;
      })
    );
  };

  // Add Item to Board Modal Handler
  const handleAddPredefined = (
    type: BoardNode['type'],
    title: string,
    subtitle: string,
    refId: string,
    color?: string
  ) => {
    soundFx.playPin();
    const newNode: BoardNode = {
      id: `node-${Date.now()}`,
      type,
      title,
      subtitle,
      x: 350 + Math.random() * 80,
      y: 150 + Math.random() * 80,
      color: color || '#c5a880',
      referenceId: refId,
    };
    onUpdateNodes([...nodes, newNode]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in flex flex-col h-[calc(100vh-80px)]">
      {/* Board Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-white/[0.08] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-data tracking-[0.25em] uppercase text-[#c5a880]">
            <span>DEDUCTIVE WORKSPACE</span>
            <span>·</span>
            <span>INVESTIGATION PINBOARD</span>
          </div>
          <h2 className="text-xl md:text-2xl font-display font-bold text-[#f5f1e8] mt-0.5">
            THE CRIME BOARD
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {connectingFromId && (
            <div className="flex items-center gap-2 bg-amber-950/80 border border-amber-600 px-3 py-1 text-xs font-mono-data text-amber-200 animate-pulse">
              <span>SELECT TARGET PIN TO CONNECT</span>
              <button
                onClick={() => setConnectingFromId(null)}
                className="hover:text-white"
              >
                ✕
              </button>
            </div>
          )}

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-[#c5a880] hover:bg-[#d8be99] text-[#0a0c0f] font-mono-data text-xs font-semibold tracking-wider uppercase flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>PIN NEW ITEM</span>
          </button>
        </div>
      </div>

      {/* Interactive Board Canvas */}
      <div
        ref={boardRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="relative flex-1 bg-[#101115] border border-white/[0.08] mt-4 overflow-hidden select-none bg-grain shadow-inner"
        style={{ minHeight: '580px' }}
      >
        {/* SVG Thread Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {connections.map((conn) => {
            const from = nodes.find((n) => n.id === conn.fromId);
            const to = nodes.find((n) => n.id === conn.toId);
            if (!from || !to) return null;

            // Approximate center coordinates of cards
            const x1 = from.x + 90;
            const y1 = from.y + 40;
            const x2 = to.x + 90;
            const y2 = to.y + 40;
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;

            return (
              <g key={conn.id} className="pointer-events-auto cursor-pointer">
                {/* Noir Red/Amber Evidence String */}
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={conn.color || '#c5a880'}
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  className="opacity-80"
                />

                {/* Connection Label Badge */}
                <g
                  onClick={() => handleChangeConnLabel(conn.id)}
                  className="hover:opacity-100 transition-opacity"
                >
                  <rect
                    x={midX - 45}
                    y={midY - 10}
                    width="90"
                    height="20"
                    fill="#0a0c0f"
                    stroke={conn.color || '#c5a880'}
                    strokeWidth="1"
                    rx="2"
                  />
                  <text
                    x={midX}
                    y={midY + 3.5}
                    textAnchor="middle"
                    fill="#ede8de"
                    fontSize="9"
                    fontFamily="JetBrains Mono, monospace"
                    letterSpacing="0.05em"
                  >
                    {conn.label}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Pinned Nodes */}
        {nodes.map((node) => {
          const isSelected = selectedNodeId === node.id;
          const isConnectingFrom = connectingFromId === node.id;

          return (
            <div
              key={node.id}
              onMouseDown={(e) => handleMouseDown(node.id, e)}
              onClick={() => setSelectedNodeId(node.id)}
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
              }}
              className={`absolute z-20 w-48 p-3 bg-[#15171e] border shadow-2xl transition-shadow cursor-grab active:cursor-grabbing ${
                isConnectingFrom
                  ? 'border-amber-400 ring-2 ring-amber-400/50'
                  : isSelected
                  ? 'border-[#c5a880] ring-1 ring-[#c5a880]/30'
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              {/* Pushpin at top center */}
              <div
                className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border border-black shadow flex items-center justify-center pointer-events-none"
                style={{ backgroundColor: node.color || '#c5a880' }}
              >
                <div className="w-1 h-1 bg-white rounded-full" />
              </div>

              {/* Node Type & Actions */}
              <div className="flex items-center justify-between text-[10px] font-mono-data text-[#888377] uppercase pt-1">
                <span style={{ color: node.color || '#c5a880' }}>{node.type}</span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleStartConnect(node.id, e)}
                    className="p-1 hover:text-[#c5a880] transition-colors"
                    title="Connect thread to another pin"
                  >
                    <Link2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteNode(node.id, e)}
                    className="p-1 hover:text-red-400 transition-colors"
                    title="Remove pin"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <h4 className="text-xs font-display font-bold text-[#ede8de] mt-1 line-clamp-1">
                {node.title}
              </h4>

              {node.subtitle && (
                <p className="text-[11px] font-mono-data text-[#9c9689] mt-0.5 line-clamp-1">
                  {node.subtitle}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal to add suspects or evidence to board */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-xl max-h-[80vh] overflow-y-auto bg-[#101217] border border-[#2d303b] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <h3 className="text-lg font-display font-bold text-[#f5f1e8]">
                PIN ARTIFACT OR SUSPECT TO BOARD
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-xs font-mono-data text-[#888377] hover:text-[#f5f1e8]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-6">
              {/* Suspects */}
              <div>
                <span className="text-[11px] font-mono-data tracking-widest text-[#c5a880] uppercase block mb-2">
                  SUSPECTS
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {caseDef.suspects.map((s) => (
                    <button
                      key={s.id}
                      onClick={() =>
                        handleAddPredefined('SUSPECT', s.name, s.role, s.id, '#c5a880')
                      }
                      className="p-2.5 bg-[#14161d] hover:bg-[#1a1d26] border border-white/[0.06] text-left text-xs text-[#ded9ce] flex items-center gap-2"
                    >
                      <Pin className="w-3 h-3 text-[#c5a880]" />
                      <span className="truncate">{s.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Evidence */}
              <div>
                <span className="text-[11px] font-mono-data tracking-widest text-[#c5a880] uppercase block mb-2">
                  DISCOVERED EVIDENCE
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {caseDef.evidence.map((ev) => (
                    <button
                      key={ev.id}
                      onClick={() =>
                        handleAddPredefined('EVIDENCE', ev.title, ev.category, ev.id, '#d97706')
                      }
                      className="p-2.5 bg-[#14161d] hover:bg-[#1a1d26] border border-white/[0.06] text-left text-xs text-[#ded9ce] flex items-center gap-2"
                    >
                      <Pin className="w-3 h-3 text-amber-500" />
                      <span className="truncate">{ev.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
