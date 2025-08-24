import React, { useState, useCallback } from 'react';
import type { ComposerCardData } from '../types';
import { generateGeminiContent } from '../services/geminiService';
import { Card, CardContent, CardTitle, CardDescription } from './Card';
import { AiButton, PostButton, ScheduleButton, ComposerTextarea } from './UI';
import { ScheduleIcon } from './Icons';
import { usePhoneShell } from '../contexts/PhoneShellContext';
import { TikTokPreviewScreen } from './TikTokPreviewScreen';

export const ComposerCard = ({
  title,
  description,
  generateButtonText,
  postButtonText,
  scheduleButtonText,
  promptGenerator,
  postUrl,
  icon,
  onSchedule,
}: Omit<ComposerCardData, 'onSchedule'> & {
  onSchedule: (content: string) => void;
}): React.ReactNode => {
  const [composedText, setComposedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const { openPhoneShell } = usePhoneShell();

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setHasGenerated(false);
    setComposedText('Mencari ilham...');
    const prompt = promptGenerator();
    const result = await generateGeminiContent(prompt);
    setComposedText(result);
    setIsLoading(false);
    setHasGenerated(true);
  }, [promptGenerator]);

  const handlePost = useCallback(() => {
    if (composedText && !isLoading) {
      navigator.clipboard
        .writeText(composedText)
        .then(() => {
          window.open(postUrl, '_blank');
        })
        .catch((err) => {
          console.error('Failed to copy text: ', err);
          alert('Gagal menyalin teks.');
        });
    }
  }, [composedText, isLoading, postUrl]);

  const handleSchedule = useCallback(() => {
    if (composedText && !isLoading) {
      onSchedule(composedText);
      setComposedText('');
      setHasGenerated(false);
    }
  }, [composedText, isLoading, onSchedule]);

  const handlePreview = useCallback(() => {
    if (title === 'TikTok' && composedText) {
      openPhoneShell('TikTok', <TikTokPreviewScreen generatedContent={composedText} />);
    }
  }, [title, composedText, openPhoneShell]);

  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
      <CardContent>
        <ComposerTextarea
          value={composedText}
          onChange={(e) => setComposedText(e.target.value)}
          placeholder="Kapsyen akan muncul di sini..."
          className="min-h-[160px]"
        />
      </CardContent>
      <AiButton onClick={handleGenerate} disabled={isLoading} className="mt-4">
        {isLoading ? 'GENERATING...' : generateButtonText}
      </AiButton>
      <div className="flex gap-2 mt-2">
        <PostButton onClick={handlePost} disabled={!composedText || isLoading} className="w-full">
          {icon}
          <span>{postButtonText}</span>
        </PostButton>
        <ScheduleButton
          onClick={handleSchedule}
          disabled={!composedText || isLoading}
          className="w-full"
        >
          <ScheduleIcon />
          <span>{scheduleButtonText}</span>
        </ScheduleButton>
      </div>
      {title === 'TikTok' && hasGenerated && !isLoading && (
        <PostButton onClick={handlePreview} className="w-full mt-2">
          <span>PREVIEW ON PHONE</span>
        </PostButton>
      )}
    </Card>
  );
};
