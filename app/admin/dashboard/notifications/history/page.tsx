'use client';

import { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';

// Types
interface SchoolClass {
  id: string;
  name: string;
  section: string | null;
}

interface NotificationMessage {
  id: string;
  message: string;
  messageType: string;
  sentToClassId: string | null;
  sentToClass: SchoolClass | null;
  totalSent: number;
  totalDelivered: number;
  createdAt: string;
}

// [UI TEXT - can be translated to Nepali]
const TYPE_LABELS: Record<string, string> = {
  fee_reminder: 'Fee Reminder',
  result: 'Result',
  exam: 'Exam',
  holiday: 'Holiday',
  general: 'General',
};

const TYPE_BADGE_COLORS: Record<string, string> = {
  fee_reminder: 'bg-orange-100 text-orange-800',
  result: 'bg-green-100 text-green-800',
  exam: 'bg-blue-100 text-blue-800',
  holiday: 'bg-purple-100 text-purple-800',
  general: 'bg-gray-100 text-gray-800',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + '...' : text;
}

export default function NotificationHistoryPage() {
  const [messages, setMessages] = useState<NotificationMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/notifications/history')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setMessages(data.data);
        } else {
          setError(data.error || 'Failed to load history');
        }
      })
      .catch(() => setError('Failed to load notification history'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-10 w-10 border-[3px] border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          {/* [UI TEXT - can be translated to Nepali] */}
          <p className="mt-4 text-sm text-gray-500">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb + Header */}
      <div>
        {/* [UI TEXT - can be translated to Nepali] */}
        <p className="text-sm text-gray-500 mb-1">
          Dashboard &gt; Notifications &gt; <span className="text-gray-700">Message History</span>
        </p>
        {/* [UI TEXT - can be translated to Nepali] */}
        <h1 className="text-2xl font-bold text-gray-900">Message History</h1>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      {messages.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {/* [UI TEXT - can be translated to Nepali] */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date &amp; Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sent To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipients
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {messages.map((msg) => {
                  const classLabel = msg.sentToClass
                    ? msg.sentToClass.section
                      ? `${msg.sentToClass.name} - ${msg.sentToClass.section}`
                      : msg.sentToClass.name
                    : 'All Parents'; // [UI TEXT - can be translated to Nepali]

                  return (
                    <tr key={msg.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(msg.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            TYPE_BADGE_COLORS[msg.messageType] ?? TYPE_BADGE_COLORS.general
                          }`}
                        >
                          {TYPE_LABELS[msg.messageType] ?? msg.messageType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                        {truncate(msg.message, 80)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {classLabel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {msg.totalSent}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty state */}
      {messages.length === 0 && !error && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <MessageSquare className="h-8 w-8 text-gray-400" />
          </div>
          {/* [UI TEXT - can be translated to Nepali] */}
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications sent yet</h3>
          <p className="text-gray-500 max-w-sm mx-auto text-sm">
            Messages you send will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
