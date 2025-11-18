'use client';

import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  addEdge,
  Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import GeminiAgentNode, { GeminiAgentData } from './flow/gemini-agent-node';
import ToolNode, { ToolNodeData } from './flow/tool-node';
import ReActAgentNode from './flow/react-agent-node';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { ChatPanel } from './chat-panel';

const nodeTypes = {
  geminiAgent: GeminiAgentNode,
  toolNode: ToolNode,
  reactAgentNode: ReActAgentNode,
};

const initialNodes: Node[] = [
  {
    id: 'model-1',
    type: 'geminiAgent',
    position: { x: 50, y: 100 },
    data: {
      apiKey: '',
      modelName: 'gemini-2.0-flash',
      systemPrompt: 'You are a helpful AI assistant.',
    },
  },
  {
    id: 'tool-1',
    type: 'toolNode',
    position: { x: 50, y: 500 },
    data: {
      toolName: 'get_weather',
    },
  },
  {
    id: 'agent-1',
    type: 'reactAgentNode',
    position: { x: 600, y: 250 },
    data: {},
  },
];

const initialEdges: Edge[] = [
  { id: 'e1', source: 'model-1', target: 'agent-1', targetHandle: 'model-in' },
  { id: 'e2', source: 'tool-1', target: 'agent-1', targetHandle: 'tools-in' },
];

export default function AgentFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeDataChange = useCallback((id: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  // Inject the onChange handler into the node data
  const nodesWithHandler = nodes.map((node) => {
    if (node.type === 'geminiAgent' || node.type === 'toolNode') {
      return {
        ...node,
        data: {
          ...node.data,
          onChange: (newData: any) => onNodeDataChange(node.id, newData),
        },
      };
    }
    return node;
  });

  const handleRun = () => {
    setIsChatOpen(true);
  };

  // Gather config from nodes
  const modelNode = nodes.find((n) => n.type === 'geminiAgent');
  const toolNodes = nodes.filter((n) => n.type === 'toolNode');
  
  const modelData = modelNode?.data as GeminiAgentData;
  const tools = toolNodes.map((n) => (n.data as ToolNodeData).toolName);

  return (
    <div className="h-screen w-full relative bg-background">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button onClick={handleRun} className="gap-2 shadow-lg">
          <Play className="h-4 w-4" /> Run Agent
        </Button>
      </div>
      
      <ReactFlow
        nodes={nodesWithHandler}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>

      {isChatOpen && modelData && (
        <ChatPanel
          config={{
            apiKey: modelData.apiKey,
            modelName: modelData.modelName,
            systemPrompt: modelData.systemPrompt,
            tools: tools,
          }}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
}
