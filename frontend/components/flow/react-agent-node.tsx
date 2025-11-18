import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Bot } from 'lucide-react';

const ReActAgentNode = () => {
  return (
    <Card className="w-[200px] border-2 border-primary shadow-lg bg-primary/5">
      <CardHeader className="bg-primary/10 pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-lg">
          <Bot className="h-6 w-6" /> ReAct Agent
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 text-center text-sm text-muted-foreground">
        Orchestrates Model and Tools
      </CardContent>
      
      {/* Inputs from Model and Tools */}
      <Handle 
        type="target" 
        position={Position.Left} 
        id="model-in"
        style={{ top: '30%' }}
        className="w-3 h-3 bg-primary" 
      />
      <Handle 
        type="target" 
        position={Position.Left} 
        id="tools-in"
        style={{ top: '70%' }}
        className="w-3 h-3 bg-secondary" 
      />
      
      {/* Output (optional, maybe to a chat interface node?) */}
      {/* For now, the chat interface is global, so no output handle needed strictly, 
          but let's add one for visual completeness */}
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-primary" />
    </Card>
  );
};

export default memo(ReActAgentNode);
