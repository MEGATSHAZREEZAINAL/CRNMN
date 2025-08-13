import React, { useState, useEffect } from 'react';
// IMPORTANT: To avoid bundling Node-only Twilio SDK in the browser, prefer calling backend endpoints for Twilio actions in production.
// Switch to backend API for Twilio actions to avoid bundling Node SDK in browser
import * as twilioApi from '../services/twilioApi';
import whatsappService from '../services/whatsappService';
import twilioConfig from '../config/twilio.config';
import { Card } from './primitives/Card';
import { Button } from './primitives/Button';
import { Input } from './primitives/Input';
import { Badge } from './primitives/Badge';

interface MessageLog {
  to: string;
  from: string;
  body: string;
  messageId: string;
  type: 'whatsapp' | 'sms';
  status: string;
  sent_at: string;
}

interface AccountInfo {
  accountSid: string;
  accountName: string;
  status: string;
  type: string;
  dateCreated: string;
  dateUpdated: string;
}

interface PhoneNumber {
  sid: string;
  phoneNumber: string;
  friendlyName: string;
  capabilities: {
    sms: boolean;
    voice: boolean;
    mms: boolean;
    whatsapp: boolean;
  };
}

interface UsageRecord {
  category: string;
  usage: string;
  count: string;
  price: string;
}

interface WhatsappStatus {
  initialized: boolean;
  queueLength: number;
  sessions: number;
}

const TwilioDashboard: React.FC = () => {
  const [messageLogs, setMessageLogs] = useState<MessageLog[]>([]);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [usageRecords, setUsageRecords] = useState<UsageRecord[]>([]);
  const [whatsappStatus, setWhatsappStatus] = useState<WhatsappStatus | null>(null);

  const [newMessage, setNewMessage] = useState({
    to: '',
    body: '',
    type: 'sms' as 'sms' | 'whatsapp',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Backend now handles Twilio initialization; no client-side SDK initialization

      // Load backend status (minimal info)
      const status = await twilioApi.getBackendStatus();
      if (status) {
        setAccountInfo({
          accountSid: 'masked',
          accountName: 'Backend',
          status: status.hasWhatsAppNumber || status.hasSmsNumber ? 'active' : 'inactive',
          type: 'server',
          dateCreated: '',
          dateUpdated: '',
        });
      }

      // Load WhatsApp status
      const whatsapp = whatsappService.getStatus();
      setWhatsappStatus(whatsapp);
    } catch (err: unknown) {
      setError('Failed to load dashboard data');
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.to || !newMessage.body) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      let result;
      if (newMessage.type === 'whatsapp') {
        result = await twilioApi.sendWhatsApp(newMessage.to, newMessage.body);
      } else {
        result = await twilioApi.sendSMS(newMessage.to, newMessage.body);
      }

      if (result.success) {
        setSuccess(`Message sent successfully! ID: ${result.messageId}`);
        setNewMessage({ to: '', body: '', type: 'sms' });
        loadDashboardData(); // Refresh logs
      } else {
        setError(result.error || 'Failed to send message');
      }
    } catch (err: unknown) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      setLoading(true);
      const result = await twilioApi.testConnection();
      if (result.success) {
        setSuccess(result.message || 'Twilio backend reachable');
      } else {
        setError(result.error || 'Connection test failed');
      }
    } catch (err: unknown) {
      setError('Connection test failed');
    } finally {
      setLoading(false);
    }
  };

  const testWhatsAppConnection = async () => {
    try {
      setLoading(true);
      const result = await whatsappService.testConnection();
      if (result.success) {
        setSuccess(result.message);
      } else {
        setError(result.message);
      }
    } catch (err: unknown) {
      setError('WhatsApp connection test failed');
    } finally {
      setLoading(false);
    }
  };

  const clearMessageQueue = () => {
    whatsappService.clearMessageQueue();
    setSuccess('Message queue cleared');
    loadDashboardData();
  };

  if (loading && messageLogs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Twilio Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Twilio Dashboard</h1>
          <p className="text-gray-600">Manage your Twilio communications and WhatsApp bot</p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Messages</p>
                <p className="text-2xl font-semibold text-gray-900">{messageLogs.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21l4-7 4 7M3 4h1M20 4h1M3 8h1M20 8h1M3 12h1M20 12h1M3 16h1M20 16h1M3 20h1M20 20h1"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Phone Numbers</p>
                <p className="text-2xl font-semibold text-gray-900">{phoneNumbers.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">WhatsApp Status</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {whatsappStatus?.initialized ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Queue Length</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {whatsappStatus?.queueLength || 0}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button onClick={testConnection} disabled={loading}>
            Test Twilio Connection
          </Button>
          <Button onClick={testWhatsAppConnection} disabled={loading}>
            Test WhatsApp Connection
          </Button>
          <Button onClick={loadDashboardData} disabled={loading}>
            Refresh Data
          </Button>
          <Button onClick={clearMessageQueue} disabled={loading}>
            Clear Message Queue
          </Button>
        </div>

        {/* Send Message Form */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Message</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              placeholder="Phone Number"
              value={newMessage.to}
              onChange={(e) => setNewMessage({ ...newMessage, to: e.target.value })}
            />
            <Input
              placeholder="Message"
              value={newMessage.body}
              onChange={(e) => setNewMessage({ ...newMessage, body: e.target.value })}
            />
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newMessage.type}
              onChange={(e) =>
                setNewMessage({ ...newMessage, type: e.target.value as 'sms' | 'whatsapp' })
              }
            >
              <option value="sms">SMS</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>
          <Button onClick={sendMessage} disabled={loading || !newMessage.to || !newMessage.body}>
            Send Message
          </Button>
        </Card>

        {/* Error and Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Message Logs */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Messages</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {messageLogs.map((log, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={log.type === 'whatsapp' ? 'brand' : 'ghost'}>
                        {log.type.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.to}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {log.body}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={log.status === 'delivered' ? 'success' : 'warning'}>
                        {log.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(log.sent_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Account Information */}
        {accountInfo && (
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Account SID</p>
                <p className="text-sm font-medium text-gray-900">{accountInfo.accountSid}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Account Name</p>
                <p className="text-sm font-medium text-gray-900">{accountInfo.accountName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge variant={accountInfo.status === 'active' ? 'success' : 'warning'}>
                  {accountInfo.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="text-sm font-medium text-gray-900">{accountInfo.type}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TwilioDashboard;
