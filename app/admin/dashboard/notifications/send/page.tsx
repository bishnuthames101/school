'use client';

import { useState, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

// Types
interface SchoolClass {
  id: string;
  name: string;
  section: string | null;
}

type MessageType = 'fee_reminder' | 'exam' | 'result' | 'holiday' | 'general';

// [UI TEXT - can be translated to Nepali]
const MESSAGE_TYPE_LABELS: Record<MessageType, string> = {
  fee_reminder: 'Fee Reminder',
  exam: 'Exam Notice',
  result: 'Result',
  holiday: 'Holiday',
  general: 'General',
};

// [UI TEXT - can be translated to Nepali] — Nepali message templates
const MESSAGE_TEMPLATES: Record<MessageType, string> = {
  fee_reminder:
    'प्रिय अभिभावक,\n\n[विद्यालयको नाम] बाट सूचित गरिन्छ कि यो महिनाको शुल्क बुझाउने समय भएको छ। कृपया शीघ्र शुल्क बुझाउनुहोस्।\n\nधन्यवाद।',
  exam: 'प्रिय अभिभावक,\n\nपरीक्षाको सूचना: [परीक्षाको विवरण यहाँ लेख्नुहोस्]। कृपया आफ्नो बच्चालाई राम्रोसँग तयार गर्नुहोस्।\n\nधन्यवाद।',
  result:
    'प्रिय अभिभावक,\n\n[विद्यालयको नाम] को परीक्षाफल प्रकाशित भएको छ। कृपया विद्यालयमा आई परीक्षाफल लिनुहोस्।\n\nधन्यवाद।',
  holiday:
    'प्रिय अभिभावक,\n\n[मिति] मा [विद्यालयको नाम] बन्द रहनेछ। सम्बन्धित सबैलाई जानकारी गराउनु होला।\n\nधन्यवाद।',
  general: '',
};

const MAX_CHARS = 500;

export default function SendNotificationPage() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [selectedType, setSelectedType] = useState<MessageType>('general');
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [message, setMessage] = useState('');
  const [parentCount, setParentCount] = useState<number | null>(null);
  const [countLoading, setCountLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // Fetch classes on mount
  useEffect(() => {
    fetch('/api/classes')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setClasses(data.data);
      })
      .catch(() => console.error('Failed to load classes'));
  }, []);

  // Fetch parent count whenever classId changes
  useEffect(() => {
    setCountLoading(true);
    const url = selectedClassId
      ? `/api/notifications/parents/count?classId=${selectedClassId}`
      : '/api/notifications/parents/count';

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setParentCount(data.count);
      })
      .catch(() => console.error('Failed to load parent count'))
      .finally(() => setCountLoading(false));
  }, [selectedClassId]);

  const handleTypeSelect = (type: MessageType) => {
    setSelectedType(type);
    setMessage(MESSAGE_TEMPLATES[type]);
    setSuccessBanner(null);
    setErrorBanner(null);
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    setSending(true);
    setSuccessBanner(null);
    setErrorBanner(null);

    try {
      const res = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          messageType: selectedType,
          classId: selectedClassId || undefined,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        // [UI TEXT - can be translated to Nepali]
        setErrorBanner(data.error || 'Failed to send messages. Please try again.');
        return;
      }

      // [UI TEXT - can be translated to Nepali]
      setSuccessBanner(`Message sent to ${data.totalSent} parents successfully.${data.totalFailed > 0 ? ` (${data.totalFailed} failed)` : ''}`);
      setMessage('');
      setSelectedType('general');
      setSelectedClassId('');
    } catch {
      // [UI TEXT - can be translated to Nepali]
      setErrorBanner('Network error. Please check your connection and try again.');
    } finally {
      setSending(false);
    }
  };

  const classLabel = (c: SchoolClass) =>
    c.section ? `${c.name} - ${c.section}` : c.name;

  return (
    <div className="space-y-6">
      {/* Breadcrumb + Header */}
      <div>
        {/* [UI TEXT - can be translated to Nepali] */}
        <p className="text-sm text-gray-500 mb-1">
          Dashboard &gt; Notifications &gt; <span className="text-gray-700">Send Message</span>
        </p>
        <div>
          {/* [UI TEXT - can be translated to Nepali] */}
          <h1 className="text-2xl font-bold text-gray-900">Send Notification</h1>
          {/* [UI TEXT - can be translated to Nepali] */}
          <p className="text-gray-500 mt-1 text-sm">Send WhatsApp message to parents</p>
        </div>
      </div>

      {/* Success Banner */}
      {successBanner && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
          ✓ {successBanner}
        </div>
      )}

      {/* Error Banner */}
      {errorBanner && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          ✗ {errorBanner}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">

        {/* Message Type — pill buttons */}
        <div>
          {/* [UI TEXT - can be translated to Nepali] */}
          <label className="block text-sm font-medium text-gray-700 mb-3">Message Type</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(MESSAGE_TYPE_LABELS) as MessageType[]).map((type) => (
              <button
                key={type}
                onClick={() => handleTypeSelect(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  selectedType === type
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600'
                }`}
              >
                {/* [UI TEXT - can be translated to Nepali] */}
                {MESSAGE_TYPE_LABELS[type]}
              </button>
            ))}
          </div>
        </div>

        {/* Class Filter */}
        <div>
          {/* [UI TEXT - can be translated to Nepali] */}
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Send To</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full sm:w-72 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {/* [UI TEXT - can be translated to Nepali] */}
            <option value="">All Parents</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {classLabel(c)}
              </option>
            ))}
          </select>

          {/* Live parent count */}
          <p className="mt-2 text-sm text-gray-500">
            {countLoading ? (
              'Counting...'
            ) : parentCount !== null ? (
              <>
                {/* [UI TEXT - can be translated to Nepali] */}
                This will be sent to{' '}
                <span className="font-semibold text-gray-800">{parentCount} parents</span>
              </>
            ) : null}
          </p>
        </div>

        {/* Message Textarea */}
        <div>
          {/* [UI TEXT - can be translated to Nepali] */}
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
          <textarea
            rows={6}
            maxLength={MAX_CHARS}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            placeholder="Type your message here..."
          />
          <p className="mt-1 text-xs text-gray-400 text-right">
            {message.length} / {MAX_CHARS}
          </p>
        </div>

        {/* Send Button */}
        <div>
          <button
            onClick={handleSend}
            disabled={sending || !message.trim() || (parentCount !== null && parentCount === 0)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {/* [UI TEXT - can be translated to Nepali] */}
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                {/* [UI TEXT - can be translated to Nepali] */}
                <span>Send Message</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
