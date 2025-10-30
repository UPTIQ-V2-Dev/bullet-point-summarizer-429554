import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { getWordCount, getCharacterCount, validateText } from '@/utils/textProcessing';
import { MAX_TEXT_LENGTH } from '@/lib/constants';

interface TextInputAreaProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
}

export const TextInputArea = ({ value, onChange, placeholder, error }: TextInputAreaProps) => {
    const [wordCount, setWordCount] = useState(0);
    const [characterCount, setCharacterCount] = useState(0);

    useEffect(() => {
        setWordCount(getWordCount(value));
        setCharacterCount(getCharacterCount(value));
    }, [value]);

    const isAtLimit = characterCount >= MAX_TEXT_LENGTH;
    const validation = validateText(value);

    return (
        <div className='space-y-2'>
            <Label htmlFor='text-input'>Source Text</Label>
            <Textarea
                id='text-input'
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder || 'Paste your text here to generate a summary...'}
                className={`min-h-[300px] resize-none ${error || !validation.isValid ? 'border-destructive' : ''}`}
                maxLength={MAX_TEXT_LENGTH}
            />
            <div className='flex items-center justify-between text-sm'>
                <div className='flex gap-4'>
                    <span className='text-muted-foreground'>
                        Words: <span className='font-medium'>{wordCount}</span>
                    </span>
                    <span className='text-muted-foreground'>
                        Characters:{' '}
                        <span className={`font-medium ${isAtLimit ? 'text-destructive' : ''}`}>
                            {characterCount}/{MAX_TEXT_LENGTH}
                        </span>
                    </span>
                </div>
                {(error || !validation.isValid) && (
                    <span className='text-destructive text-xs'>{error || validation.error}</span>
                )}
            </div>
        </div>
    );
};
