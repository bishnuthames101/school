'use client';

import { useState, useEffect } from 'react';
import { Activity, Filter } from 'lucide-react';

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: string;
  createdAt: string;
}

const ACTION_COLORS: Record<string, string> = {
  LOGIN:   'bg-blue-100 text-blue-800',
  LOGOUT:  'bg-gray-100 text-gray-700',
  CREATE:  'bg-green-100 text-green-800',
  UPDATE:  'bg-yellow-100 text-yellow-800',
  DELETE:  'bg-red-100 text-red-800',
};

const ENTITIES = ['All', 'Admin', 'Event', 'Notice', 'Gallery', 'Popup', 'Application', 'Contact'];
const ACTIONS  = ['All', 'LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE'];

export default function ActivityLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterEntity, setFilterEntity] = useState('All');
  const [filterAction, setFilterAction] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchLogs();
  }, [page, filterEntity, filterAction]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: '50' });
      if (filterEntity !== 'All') params.set('entity', filterEntity);
      if (filterAction !== 'All') params.set('action', filterAction);

      const response = await fetch(`/api/logs?${params}`);
      if (!response.ok) throw new Error('Failed to fetch logs');
      const result = await response.json();
      setLogs(result.data || []);
      setTotalPages(result.pagination?.totalPages || 1);
      setTotal(result.pagination?.total || 0);
      setError('');
    } catch (err) {
      setError('Failed to load activity logs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (entity: string, action: string) => {
    setFilterEntity(entity);
    setFilterAction(action);
    setPage(1);
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm text-gray-500 mb-1">
          Dashboard &gt; <span className="text-gray-700">Activity Logs</span>
        </p>
        <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Audit trail of all admin actions — {total} total entries
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <div className="flex flex-wrap gap-2">
            <div>
              <select
                value={filterAction}
                onChange={(e) => handleFilterChange(filterEntity, e.target.value)}
                className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {ACTIONS.map((a) => (
                  <option key={a} value={a}>{a === 'All' ? 'All Actions' : a}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={filterEntity}
                onChange={(e) => handleFilterChange(e.target.value, filterAction)}
                className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {ENTITIES.map((e) => (
                  <option key={e} value={e}>{e === 'All' ? 'All Entities' : e}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Logs List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <div className="h-10 w-10 border-[3px] border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-sm text-gray-500">Loading logs...</p>
          </div>
        </div>
      ) : logs.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                {/* Action badge */}
                <span className={`flex-shrink-0 mt-0.5 text-xs font-bold px-2 py-0.5 rounded ${ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-700'}`}>
                  {log.action}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-900">{log.entity}</span>
                    {log.entityId && (
                      <span className="text-xs text-gray-400 font-mono truncate max-w-[120px]" title={log.entityId}>
                        #{log.entityId.slice(-8)}
                      </span>
                    )}
                    {log.details && (
                      <span className="text-sm text-gray-600 truncate">{log.details}</span>
                    )}
                  </div>
                </div>

                {/* Time */}
                <span className="flex-shrink-0 text-xs text-gray-400 whitespace-nowrap">{formatTime(log.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Activity className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No activity logs yet</h3>
          <p className="text-gray-500 text-sm">Actions taken in the admin panel will appear here.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
