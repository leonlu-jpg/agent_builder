import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export type GeminiAgentData = {
  apiKey: string;
  modelName: string;
  systemPrompt: string;
  onChange: (data: Partial<GeminiAgentData>) => void;
};

const GeminiAgentNode = ({ data }: { data: GeminiAgentData }) => {
  return (
    <Card className="w-[400px] border-2 border-primary shadow-lg">
      <CardHeader className="bg-muted/50 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="text-2xl">🧠</span> Gemini Model
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 p-4">
        <div className="grid gap-2">
          <Label htmlFor="model">Model</Label>
          <select
            id="model"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={data.modelName}
            onChange={(e) => data.onChange({ modelName: e.target.value })}
          >
            <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
            <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
          </select>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="apiKey">API Key</Label>
          <Input
            id="apiKey"
            type="password"
            placeholder="Enter Google API Key"
            value={data.apiKey}
            onChange={(e) => data.onChange({ apiKey: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="prompt">System Prompt</Label>
          <Textarea
            id="prompt"
            placeholder="You are a helpful assistant..."
            className="min-h-[100px]"
            value={data.systemPrompt}
            onChange={(e) => data.onChange({ systemPrompt: e.target.value })}
          />
        </div>
      </CardContent>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-primary" />
    </Card>
  );
};

export default memo(GeminiAgentNode);
