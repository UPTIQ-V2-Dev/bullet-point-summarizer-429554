import { Button } from '@/components/ui/button';
import { Trash2, FileText } from 'lucide-react';

interface InputControlsProps {
    onClear: () => void;
    onPasteSample: (text: string) => void;
    disabled?: boolean;
    hasText: boolean;
}

const sampleText =
    'Q3 Marketing Strategy, Project Alpha Alpha Start-up Notes Latest Industry Report, AI will analyze and condense the key information.';

export const InputControls = ({ onClear, onPasteSample, disabled, hasText }: InputControlsProps) => {
    const handlePasteSample = () => {
        onPasteSample(sampleText);
    };

    return (
        <div className='flex flex-col sm:flex-row gap-2'>
            <Button
                variant='outline'
                size='sm'
                onClick={handlePasteSample}
                disabled={disabled}
                className='flex items-center gap-2'
            >
                <FileText className='h-4 w-4' />
                Paste Sample Text
            </Button>
            {hasText && (
                <Button
                    variant='outline'
                    size='sm'
                    onClick={onClear}
                    disabled={disabled}
                    className='flex items-center gap-2'
                >
                    <Trash2 className='h-4 w-4' />
                    Clear
                </Button>
            )}
        </div>
    );
};
