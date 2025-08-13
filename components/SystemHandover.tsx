import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardTitle, CardDescription } from './Card';
import { AiButton } from './UI';
import { QrCodeIcon, DocumentTextIcon, CheckCircleIcon } from './Icons';
import { SYSTEM_HANDOVER_DOCS } from '../constants';

interface SystemHandoverProps {
  isBotConnected: boolean;
  onConnect: () => void;
}

const FakeQRCode = () => (
  <div className="bg-white p-2 rounded-md w-48 h-48 mx-auto flex items-center justify-center">
    {/* Simple SVG QR Code representation */}
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <path
        fill="black"
        d="M0 0h30v30H0z M10 10h10v10H10z M70 0h30v30H70z M80 10h10v10H80z M0 70h30v30H0z M10 80h10v10H10z M40 0h10v10H40z M60 0h10v10H60z M0 40h10v10H0z M0 60h10v10H0z M100 40h-10v10h10z M100 60h-10v10h10z M40 100h10v-10H40z M60 100h10v-10H60z M40 40h30v10H40z M40 60h10v10H40z M60 60h10v30H60z M80 40h10v20H80z M40 80h10v10H40z M80 80h20v20H80z"
      />
    </svg>
  </div>
);

export const SystemHandover = ({
  isBotConnected,
  onConnect,
}: SystemHandoverProps): React.ReactNode => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = useCallback(() => {
    setIsConnecting(true);
    setTimeout(() => {
      onConnect();
      setIsConnecting(false);
    }, 2000);
  }, [onConnect]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardContent>
          <CardTitle>
            <div className="flex items-center gap-2">
              <DocumentTextIcon className="w-6 h-6" />
              <span>SYSTEM HANDOVER</span>
            </div>
          </CardTitle>
          <CardDescription>Documentation on how this OS works.</CardDescription>
          <div className="bg-black p-4 mt-4 rounded-lg text-sm text-gray-300 space-y-4 h-[420px] overflow-y-auto">
            <div>
              <h4 className="font-bold text-[#39FF14] mb-2">System Introduction</h4>
              <p className="whitespace-pre-wrap">{SYSTEM_HANDOVER_DOCS.docs}</p>
            </div>
            <div>
              <h4 className="font-bold text-[#39FF14] mb-2">How to Use</h4>
              <p className="whitespace-pre-wrap">{SYSTEM_HANDOVER_DOCS.tutorial}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <CardTitle>
            <div className="flex items-center gap-2">
              <QrCodeIcon className="w-6 h-6" />
              <span>WHATSAPP BOT SETUP</span>
            </div>
          </CardTitle>
          <CardDescription>Connect to the WhatsApp Command Center.</CardDescription>

          <div className="bg-black p-6 mt-4 rounded-lg text-center h-[420px] flex flex-col justify-center">
            {isBotConnected ? (
              <div className="flex flex-col items-center justify-center h-full">
                <CheckCircleIcon className="w-24 h-24 text-green-400 mb-4" />
                <h4 className="font-teko text-3xl text-green-400">SUCCESSFULLY CONNECTED</h4>
                <p className="text-gray-400">
                  Bot is now active on <span className="font-mono">+60 11-3456 7890</span>
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <p className="text-gray-400 mb-4">
                  Scan the QR code with your phone to link the bot.
                </p>
                <FakeQRCode />
                <AiButton onClick={handleConnect} disabled={isConnecting} className="mt-6">
                  {isConnecting ? 'CONNECTING...' : 'SIMULATE SCAN & CONNECT'}
                </AiButton>
                <p className="text-xs text-gray-600 mt-4 text-left">
                  <strong>Nota Penting: Ini adalah simulasi.</strong> Mengklik butang di atas hanya
                  'menyambungkan' bot di dalam aplikasi ini.
                  <br />
                  <br />
                  Untuk membina <strong>bot WhatsApp sebenar</strong> menggunakan library seperti{' '}
                  <code>Baileys</code> atau <code>whatsapp-web.js</code>, sebuah server backend
                  (Node.js) diperlukan kerana ia tidak boleh berjalan terus di dalam browser. Anda
                  boleh hoskan backend ini secara percuma di platform seperti{' '}
                  <strong>Vercel, Render,</strong> atau <strong>Fly.io</strong>, kemudian sambungkan
                  dashboard ini ke API bot anda. Simulator ini direka untuk meniru aliran kerja
                  tersebut.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
