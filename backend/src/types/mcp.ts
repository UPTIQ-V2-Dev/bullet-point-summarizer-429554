import z from 'zod';

export interface MCPTool {
    id: string;
    name: string;
    description: string;
    inputSchema: z.ZodObject<any>;
    // Output schema is *mandatory* if the tool returns a value
    outputSchema?: z.ZodType<any>;
    fn: (inputs: any) => Promise<any> | any;
}
