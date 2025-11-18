import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Wrench } from 'lucide-react';

export type ToolNodeData = {
  toolName: string;
  onChange: (data: Partial<ToolNodeData>) => void;
};

const ToolNode = ({ data }: { data: ToolNodeData }) => {
  return (
    <Card className="w-[250px] border-2 border-secondary shadow-lg">
      <CardHeader className="bg-muted/50 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wrench className="h-5 w-5" /> Tool
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 p-4">
        <div className="grid gap-2">
          <Label htmlFor="tool">Select Tool</Label>
          <select
            id="tool"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={data.toolName}
            onChange={(e) => data.onChange({ toolName: e.target.value })}
          >
            <option value="get_weather">Weather (Mock)</option>
            {/* Add more tools here later */}
          </select>
        </div>
      </CardContent>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-secondary" />
    </Card>
  );
};

export default memo(ToolNode);
