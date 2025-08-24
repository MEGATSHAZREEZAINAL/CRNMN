import React, { useState } from 'react';
import { Card, CardContent, CardTitle, CardDescription } from './Card';
import { AiButton } from './UI';

export const WebsiteHub = (): React.ReactNode => {
  const [isPublished, setIsPublished] = useState(false);
  const [isSynced, setIsSynced] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card>
          <CardContent>
            <CardTitle>🌐 WEBSITE & ONLINE PRESENCE HUB</CardTitle>
            <CardDescription>
              Manage your one-click website, online ordering, and Google My Business profile.
            </CardDescription>
            <div className="mt-6 aspect-video bg-black rounded-lg p-2 border-4 border-gray-700">
              <div className="w-full h-full border border-dashed border-gray-600 rounded-md flex flex-col">
                <div className="bg-gray-800 p-2 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="bg-gray-700 text-xs text-gray-400 rounded-full px-4 py-1 ml-4">
                    https://cornman.onrender.com
                  </div>
                </div>
                <div
                  className="flex-grow p-8 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      'url(https://images.unsplash.com/photo-1599408797132-34a65e77aa53?q=80&w=2070&auto=format&fit=crop)',
                  }}
                >
                  <div className="bg-black bg-opacity-70 p-8 rounded-lg text-center">
                    <h1 className="font-teko text-6xl text-white">CORNMAN</h1>
                    <p className="text-xl tracking-widest text-[#39FF14]">Street Corn. Elevated.</p>
                    <button className="mt-8 bg-[#39FF14] text-black font-bold py-3 px-8 rounded-sm font-teko text-2xl">
                      ORDER NOW
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardContent>
            <CardTitle>⚙️ CONTROLS</CardTitle>
            <CardDescription>Publish your site and sync with other platforms.</CardDescription>
            <div className="mt-6 flex flex-col gap-4">
              <div className="bg-black p-4 rounded-lg">
                <p className="font-bold text-white mb-2">Website Status</p>
                <p className={`text-sm ${isPublished ? 'text-green-400' : 'text-yellow-400'}`}>
                  {isPublished ? 'Your site is live!' : 'Not Published'}
                </p>
                <AiButton onClick={() => setIsPublished((p) => !p)} className="mt-4">
                  {isPublished ? 'UNPUBLISH SITE' : 'PUBLISH SITE'}
                </AiButton>
              </div>
              <div className="bg-black p-4 rounded-lg">
                <p className="font-bold text-white mb-2">Google My Business</p>
                <p className={`text-sm ${isSynced ? 'text-green-400' : 'text-yellow-400'}`}>
                  {isSynced ? 'Synced with Google' : 'Not Synced'}
                </p>
                <AiButton
                  onClick={() => setIsSynced((p) => !p)}
                  className="mt-4"
                  disabled={!isPublished}
                >
                  {isSynced ? 'UNSYNC FROM GOOGLE' : 'SYNC WITH GOOGLE'}
                </AiButton>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
