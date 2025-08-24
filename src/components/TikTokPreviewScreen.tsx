import React, { useMemo } from 'react';
import { InstagramIcon, TikTokIcon } from './Icons'; // Using InstagramIcon as a placeholder for a user avatar

interface TikTokPreviewScreenProps {
  generatedContent: string;
}

const parseContent = (content: string) => {
  const conceptMatch = content.match(/KONSEP:\s*([\s\S]*?)(?=\n\n|AUDIO:|$)/i);
  const audioMatch = content.match(/AUDIO:\s*([\s\S]*?)(?=\n\n|KAPSYEN:|$)/i);
  const captionMatch = content.match(/KAPSYEN:\s*([\s\S]*?)$/i);

  return {
    concept: conceptMatch ? conceptMatch[1].trim() : 'No concept provided',
    audio: audioMatch ? audioMatch[1].trim() : 'No audio suggestion',
    caption: captionMatch ? captionMatch[1].trim() : 'No caption provided',
  };
};

export const TikTokPreviewScreen = ({
  generatedContent,
}: TikTokPreviewScreenProps): React.ReactNode => {
  const { concept, audio, caption } = useMemo(
    () => parseContent(generatedContent),
    [generatedContent],
  );

  return (
    <div
      className="h-full w-full bg-black text-white flex flex-col items-center justify-center relative bg-cover bg-center"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1611605698335-8b1569810432?q=80&w=1974&auto=format&fit=crop)',
      }}
    >
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Overlay UI */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <div className="font-bold flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <InstagramIcon className="w-6 h-6 text-black" />
          </div>
          <span>@cornman.my</span>
        </div>
        <p className="text-sm mt-2">{caption}</p>
        <div className="flex items-center gap-2 mt-2 text-sm">
          <TikTokIcon className="w-4 h-4" />
          <p className="truncate">Music suggestion: {audio}</p>
        </div>
      </div>

      {/* Side UI */}
      <div className="absolute right-2 bottom-24 flex flex-col items-center gap-4 z-10">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-xs font-bold">12.3k</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.08-3.083A6.98 6.98 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.724 14.492A7.002 7.002 0 0010 16c3.309 0 6-2.691 6-6s-2.691-6-6-6-6 2.691-6 6c0 1.222.388 2.36.996 3.328l.04.063z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-xs font-bold">1.1k</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
          </div>
          <span className="text-xs font-bold">892</span>
        </div>
      </div>

      <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full z-10">
        <p className="text-xs font-mono">CONCEPT: {concept}</p>
      </div>
    </div>
  );
};
