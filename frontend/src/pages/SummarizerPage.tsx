import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Settings } from 'lucide-react';
import { TextInputArea } from '@/components/TextInput/TextInputArea';
import { InputControls } from '@/components/TextInput/InputControls';
import { SummaryDisplay } from '@/components/Summary/SummaryDisplay';
import { LoadingState } from '@/components/Summary/LoadingState';
import { SlackPreview } from '@/components/Slack/SlackPreview';
import { useSummary } from '@/hooks/useSummary';
import { validateText, cleanText } from '@/utils/textProcessing';

export const SummarizerPage = () => {
    const [inputText, setInputText] = useState('');
    const [error, setError] = useState('');

    const summaryMutation = useSummary();

    const handleTextChange = (value: string) => {
        setInputText(value);
        setError('');
    };

    const handleClearText = () => {
        setInputText('');
        setError('');
    };

    const handlePasteSample = (text: string) => {
        setInputText(text);
        setError('');
    };

    const handleGenerateSummary = () => {
        const cleanedText = cleanText(inputText);
        const validation = validateText(cleanedText);

        if (!validation.isValid) {
            setError(validation.error || 'Invalid text');
            return;
        }

        summaryMutation.mutate({
            text: cleanedText,
            maxBulletPoints: 7,
            tone: 'professional',
            includeEmojis: false
        });
    };

    const handleConnectSlack = () => {
        // This would typically open Slack OAuth flow
        console.log('Connecting to Slack...');
    };

    const canGenerate = inputText.trim().length > 0 && validateText(inputText).isValid;

    return (
        <div className='space-y-6'>
            {/* Step 1: Paste Source Text */}
            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
                    <CardTitle className='text-xl font-semibold flex items-center gap-2'>
                        <span className='flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold'>
                            1
                        </span>
                        Paste Source Text
                    </CardTitle>
                    <Button
                        variant='outline'
                        size='sm'
                        className='flex items-center gap-2'
                    >
                        <Settings className='h-4 w-4' />
                        Options
                    </Button>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <TextInputArea
                        value={inputText}
                        onChange={handleTextChange}
                        error={error}
                        placeholder='(eg). Q3 Marketing Strategy, Project Alpha Alpha Start-up Notes Latest Industry Report, AI will analyze and condense the key information.'
                    />
                    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                        <InputControls
                            onClear={handleClearText}
                            onPasteSample={handlePasteSample}
                            disabled={summaryMutation.isPending}
                            hasText={inputText.length > 0}
                        />
                        <Button
                            onClick={handleGenerateSummary}
                            disabled={!canGenerate || summaryMutation.isPending}
                            className='w-full sm:w-auto'
                        >
                            Generate Summary
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Separator />

            {/* Step 2: Generated Summary */}
            {summaryMutation.isPending && <LoadingState />}

            {summaryMutation.data && (
                <div className='space-y-6'>
                    <div className='flex items-center gap-2'>
                        <span className='flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold'>
                            2
                        </span>
                        <span className='text-xl font-semibold'>Generated Summary</span>
                    </div>
                    <SummaryDisplay summary={summaryMutation.data} />

                    <Separator />

                    {/* Step 3: Slack Preview & Send */}
                    <div className='space-y-4'>
                        <div className='flex items-center gap-2'>
                            <span className='flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold'>
                                3
                            </span>
                            <span className='text-xl font-semibold'>Slack Message Preview & Send</span>
                        </div>
                        <SlackPreview
                            summary={summaryMutation.data.bulletPoints}
                            onConnectSlack={handleConnectSlack}
                            isConnected={true}
                        />
                    </div>
                </div>
            )}

            {summaryMutation.isError && (
                <Card className='border-destructive'>
                    <CardContent className='pt-6'>
                        <div className='text-center space-y-2'>
                            <p className='text-destructive font-medium'>Failed to generate summary</p>
                            <p className='text-sm text-muted-foreground'>
                                {summaryMutation.error?.message || 'An unexpected error occurred. Please try again.'}
                            </p>
                            <Button
                                onClick={() => summaryMutation.reset()}
                                variant='outline'
                                size='sm'
                            >
                                Try Again
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
