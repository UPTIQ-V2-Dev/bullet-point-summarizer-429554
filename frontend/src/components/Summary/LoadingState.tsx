import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export const LoadingState = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className='text-lg font-semibold'>Generating Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <div className='flex items-center justify-center py-12'>
                    <div className='flex flex-col items-center gap-4'>
                        <Loader2 className='h-8 w-8 animate-spin text-primary' />
                        <p className='text-sm text-muted-foreground'>
                            AI is analyzing your text and generating bullet points...
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
