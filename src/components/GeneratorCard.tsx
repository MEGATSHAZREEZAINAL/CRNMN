import React, { useState, useCallback } from 'react';
import type { GeneratorCardData } from '../types';
import { generateGeminiContent } from '../services/geminiService';
import { Card, CardContent, CardTitle, CardDescription } from './Card';
import { AiButton, ComposerTextarea, PostButton } from './UI';

export const GeneratorCard = ({
  title,
  description,
  buttonText,
  prompt,
  onSaveAsProject,
}: GeneratorCardData): React.ReactNode => {
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setHasGenerated(false);
    setOutput('Mencari ilham...');
    const result = await generateGeminiContent(prompt);
    setOutput(result);
    setIsLoading(false);
    setHasGenerated(true);
  }, [prompt]);

  const handleSave = useCallback(() => {
    if (output && onSaveAsProject) {
      onSaveAsProject(output);
      setHasGenerated(false); // Reset to allow generating a new idea without saving again
    }
  }, [output, onSaveAsProject]);

  return (
    <Card>
      <CardContent>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <ComposerTextarea
          value={output}
          readOnly
          placeholder="Idea akan muncul di sini..."
          className="min-h-[120px]"
        />
      </CardContent>
      <div className="flex flex-col gap-2">
        <AiButton onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? 'GENERATING...' : buttonText}
        </AiButton>
        {hasGenerated && onSaveAsProject && !isLoading && (
          <PostButton onClick={handleSave}>⊕ Jadikan Projek</PostButton>
        )}
      </div>
    </Card>
  );
};
