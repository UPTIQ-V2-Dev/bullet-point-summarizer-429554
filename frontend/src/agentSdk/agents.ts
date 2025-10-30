import { type ZodSchema, z } from 'zod';

type TriggerEvent =
    | {
          type: 'async';
          name: string;
          description: string;
      }
    | {
          type: 'sync';
          name: string;
          description: string;
          outputSchema: ZodSchema;
      };

export type AgentConfig = {
    id: string;
    name: string;
    description: string;
    triggerEvents: TriggerEvent[];
    config: {
        appId: string;
        accountId: string;
        widgetKey: string;
    };
};
export const AGENT_CONFIGS: AgentConfig[] = [
    {
        id: '90d76718-973e-4519-bfde-f182d01d45a0',
        name: 'Slack Summary Agent',
        description: 'An AI agent designed to extract summaries from provided content and send them via Slack.',
        triggerEvents: [
            {
                type: 'sync',
                name: 'Paste Source Text textarea',
                description:
                    'user can enter row data in Paste Source Text then should be input for agent "Summary Provider Agent" and provide output in Generated Summary. after click on Generate Summary',
                outputSchema: z.object({
                    summary: z.string().describe('The generated summary of the provided text')
                })
            }
        ],
        config: {
            appId: 'sagar-test',
            accountId: '03eb9ecc-c83e-4471-a489-9ae04ba4c012',
            widgetKey: '3hM6TZxBPiMSKE2eCqY2YXwL5bnVR8WkMfQnG4qL'
        }
    }
];
