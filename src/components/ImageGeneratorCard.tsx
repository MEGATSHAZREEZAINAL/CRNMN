import React, { useState, useCallback } from 'react';
import type { ImageGeneratorCardData } from '../types';
import { generateImage } from '../services/geminiService';
import { Card, CardContent, CardTitle, CardDescription } from './Card';
import { AiButton, ComposerTextarea } from './UI';

export const ImageGeneratorCard = ({
  title,
  description,
  buttonText,
  placeholder,
}: ImageGeneratorCardData): React.ReactNode => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = useCallback(async () => {
    if (!prompt) {
      setError('Sila masukkan prom untuk menjana imej.');
      return;
    }
    setIsLoading(true);
    setImageUrl('');
    setError('');
    const result = await generateImage(`${prompt}, 4k, high quality, cinematic`);
    if (result.startsWith('data:image')) {
      setImageUrl(result);
    } else {
      setError(result); // result is an error message
    }
    setIsLoading(false);
  }, [prompt]);

  return (
    <Card>
      <CardContent>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="w-full aspect-square bg-black rounded-sm flex items-center justify-center my-4 border border-[#444]">
          {isLoading && <p className="text-gray-400 animate-pulse">Menjana Imej...</p>}
          {error && <p className="text-red-500 text-sm p-4 text-center">{error}</p>}
          {imageUrl && !isLoading && (
            <img
              src={imageUrl}
              alt="Generated visual"
              className="w-full h-full object-cover rounded-sm"
            />
          )}
          {!isLoading && !imageUrl && !error && (
            <p className="text-gray-600 text-xs text-center p-4">Imej akan muncul di sini</p>
          )}
        </div>
        <ComposerTextarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={placeholder}
          className="mt-0 min-h-[100px]"
        />
      </CardContent>
      <div>
        <AiButton onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? 'GENERATING...' : buttonText}
        </AiButton>
      </div>
    </Card>
  );
};
