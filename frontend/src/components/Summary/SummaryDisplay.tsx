import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { GenerateSummaryResponse } from '@/types/summary';

interface SummaryDisplayProps {
    summary: GenerateSummaryResponse;
}

export const SummaryDisplay = ({ summary }: SummaryDisplayProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            const textToCopy = summary.bulletPoints.join('\n');
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy text:', error);
        }
    };

    return (
        <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
                <CardTitle className='text-lg font-semibold'>Generated Summary</CardTitle>
                <div className='flex items-center gap-2'>
                    <Badge
                        variant='secondary'
                        className='text-xs'
                    >
                        {summary.wordCount} words • {summary.readingTime} min read
                    </Badge>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={handleCopy}
                        className='flex items-center gap-2'
                    >
                        {copied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
                        {copied ? 'Copied' : 'Copy'}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className='space-y-3'>
                    {summary.bulletPoints.map((point, index) => (
                        <div
                            key={index}
                            className='flex items-start gap-2'
                        >
                            <span className='text-muted-foreground select-none'>•</span>
                            <span className='flex-1'>{point.replace(/^•\s*/, '')}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
