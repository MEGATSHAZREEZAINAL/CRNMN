import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Power,
  QrCode,
  Users,
  Activity,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import whatsappService from '../../services/whatsappService';

interface BotMetrics {
  isConnected: boolean;
  totalUsers: number;
  messagesReceived: number;
  messagesSent: number;
  uptime: string;
  lastActivity: string;
}

export const WhatsAppBotDashboard: React.FC = () => {
  const [botStatus, setBotStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>(
    'disconnected',
  );
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<BotMetrics>({
    isConnected: false,
    totalUsers: 0,
    messagesReceived: 0,
    messagesSent: 0,
    uptime: '0m',
    lastActivity: 'Never',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Listen for connection changes
    whatsappService.onConnectionChange((status) => {
      setBotStatus(status ? 'connected' : 'disconnected');
      setMetrics((prev) => ({ ...prev, isConnected: status }));
      if (status) {
        setQrCode(null); // Clear QR code when connected
      }
    });

    // Check initial status
    const initialStatus = whatsappService.getConnectionStatus();
    setBotStatus(initialStatus ? 'connected' : 'disconnected');
  }, []);

  const handleStartBot = async () => {
    setLoading(true);
    setBotStatus('connecting');
    setQrCode(null);

    try {
      const result = await whatsappService.startBot();

      if (result.success) {
        setBotStatus('connected');
      } else if (result.qrCode) {
        setQrCode(result.qrCode);
        setBotStatus('disconnected'); // Still not connected, waiting for QR scan
      } else {
        setBotStatus('error');
      }
    } catch (error) {
      setBotStatus('error');
      console.error('Error starting bot:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStopBot = async () => {
    setLoading(true);
    try {
      await whatsappService.disconnect();
      setBotStatus('disconnected');
      setQrCode(null);
    } catch (error) {
      console.error('Error stopping bot:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-400 bg-green-400/20';
      case 'connecting':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'error':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4" />;
      case 'connecting':
        return <Activity className="w-4 h-4 animate-pulse" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Power className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">WhatsApp Bot Management</h1>
          <p className="text-dark-300 font-mono">Real WhatsApp Business Integration</p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(botStatus)}`}
          >
            {getStatusIcon(botStatus)}
            {botStatus.charAt(0).toUpperCase() + botStatus.slice(1)}
          </div>
          {botStatus === 'connected' ? (
            <button
              onClick={handleStopBot}
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Stopping...' : 'Stop Bot'}
            </button>
          ) : (
            <button
              onClick={handleStartBot}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Starting...' : 'Start Bot'}
            </button>
          )}
        </div>
      </div>

      {/* Bot Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <MessageCircle className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-2xl font-bold text-white">{metrics.messagesReceived}</span>
          </div>
          <h3 className="text-dark-300 font-medium">Messages Received</h3>
          <p className="text-sm text-dark-400 mt-1">Total incoming</p>
        </div>

        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <MessageCircle className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-2xl font-bold text-white">{metrics.messagesSent}</span>
          </div>
          <h3 className="text-dark-300 font-medium">Messages Sent</h3>
          <p className="text-sm text-dark-400 mt-1">Total outgoing</p>
        </div>

        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-2xl font-bold text-white">{metrics.totalUsers}</span>
          </div>
          <h3 className="text-dark-300 font-medium">Active Users</h3>
          <p className="text-sm text-dark-400 mt-1">Registered users</p>
        </div>

        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Activity className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-2xl font-bold text-white">{metrics.uptime}</span>
          </div>
          <h3 className="text-dark-300 font-medium">Uptime</h3>
          <p className="text-sm text-dark-400 mt-1">Bot running time</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connection Status */}
        <div className="bg-dark-800 rounded-xl border border-dark-700">
          <div className="p-6 border-b border-dark-700">
            <h2 className="text-xl font-semibold text-white">Connection Status</h2>
          </div>
          <div className="p-6">
            {botStatus === 'connected' && (
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Bot Connected</h3>
                <p className="text-dark-300">
                  WhatsApp bot is running and ready to receive messages.
                </p>
                <div className="mt-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <p className="text-green-400 text-sm">
                    ✅ Ready to handle business commands
                    <br />
                    ✅ Anti-ban measures active
                    <br />✅ Real-time data integration
                  </p>
                </div>
              </div>
            )}

            {botStatus === 'connecting' && (
              <div className="text-center">
                <Activity className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-pulse" />
                <h3 className="text-lg font-semibold text-white mb-2">Connecting...</h3>
                <p className="text-dark-300">Initializing WhatsApp connection...</p>
              </div>
            )}

            {botStatus === 'disconnected' && !qrCode && (
              <div className="text-center">
                <Power className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Bot Offline</h3>
                <p className="text-dark-300">Click "Start Bot" to begin WhatsApp integration.</p>
              </div>
            )}

            {qrCode && (
              <div className="text-center">
                <QrCode className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Scan QR Code</h3>
                <p className="text-dark-300 mb-4">
                  Open WhatsApp on your phone and scan this QR code:
                </p>
                <div className="bg-white p-4 rounded-lg inline-block">
                  <pre className="text-xs font-mono text-black whitespace-pre-wrap">{qrCode}</pre>
                </div>
                <p className="text-sm text-dark-400 mt-4">
                  Go to WhatsApp → Settings → Linked Devices → Link a Device
                </p>
              </div>
            )}

            {botStatus === 'error' && (
              <div className="text-center">
                <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Connection Error</h3>
                <p className="text-dark-300">Failed to connect to WhatsApp. Please try again.</p>
              </div>
            )}
          </div>
        </div>

        {/* Bot Commands */}
        <div className="bg-dark-800 rounded-xl border border-dark-700">
          <div className="p-6 border-b border-dark-700">
            <h2 className="text-xl font-semibold text-white">Available Commands</h2>
            <p className="text-dark-400 text-sm mt-1">Commands that users can send to the bot</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { command: 'daftar', description: 'Register to use the bot' },
                { command: 'help', description: 'Show all available commands' },
                { command: 'status jualan', description: 'Get latest sales status' },
                { command: 'check stok', description: 'Check inventory levels' },
                { command: 'stok rendah', description: 'Show low stock alerts' },
                { command: 'revenue harini', description: "Get today's revenue" },
                { command: 'order stok [item]', description: 'Place restock order' },
              ].map((cmd, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-dark-700 rounded-lg">
                  <div className="px-2 py-1 bg-brand-electric/20 text-brand-electric rounded text-sm font-mono">
                    {cmd.command}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{cmd.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <h4 className="text-blue-400 font-semibold mb-2">Features:</h4>
              <ul className="text-blue-300 text-sm space-y-1">
                <li>• Real-time business data integration</li>
                <li>• User registration & authorization</li>
                <li>• Automatic restock ordering</li>
                <li>• Anti-ban protection measures</li>
                <li>• Human-like response timing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Setup Instructions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-white font-semibold mb-3">1. Prerequisites</h3>
            <ul className="text-dark-300 text-sm space-y-2">
              <li>
                • Install required dependencies:{' '}
                <code className="bg-dark-600 px-2 py-1 rounded">
                  npm install @adiwajshing/baileys qrcode-terminal pino
                </code>
              </li>
              <li>• Make sure Supabase database has the required tables</li>
              <li>• Have a dedicated phone number for the bot</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">2. Database Setup</h3>
            <ul className="text-dark-300 text-sm space-y-2">
              <li>
                • Create <code className="bg-dark-600 px-2 py-1 rounded">whatsapp_users</code> table
              </li>
              <li>
                • Create <code className="bg-dark-600 px-2 py-1 rounded">restock_orders</code> table
              </li>
              <li>• Ensure proper RLS policies are in place</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
