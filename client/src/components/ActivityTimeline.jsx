import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function ActivityTimeline({ issueId }) {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await api.get(`/api/issues/${issueId}/activity`);
                if (mounted) setLogs(res.data);
            } catch (err) {
                console.error("Failed to load activity", err);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [issueId]);

    if (loading) return <div className="text-sm text-slate-500 animate-pulse">Loading history...</div>;
    if (logs.length === 0) return <div className="text-sm text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">No activity recorded yet.</div>;

    return (
        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {logs.map((log) => (
                <div key={log._id} className="relative flex gap-4 text-sm group">
                    {/* Avatar */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm ring-4 ring-white z-10">
                        {log.userId?.name ? log.userId.name.substring(0, 2).toUpperCase() : '??'}
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors shadow-sm">
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-slate-900">{log.userId?.name || 'Unknown User'}</span>
                            <span className="text-xs text-slate-400 font-medium">{new Date(log.timestamp).toLocaleString()}</span>
                        </div>

                        <div className="text-slate-600">
                            {log.action === 'created' && <span>created this issue</span>}
                            {log.action === 'moved' && (
                                <span>
                                    moved from <span className="font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200">{log.details?.before?.status}</span> to <span className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">{log.details?.after?.status}</span>
                                </span>
                            )}
                            {log.action === 'updated' && (
                                <div>
                                    updated the issue
                                    {log.details?.changes && (
                                        <ul className="mt-2 space-y-1">
                                            {Object.keys(log.details.changes).map(key => (
                                                <li key={key} className="text-xs flex items-center gap-2 text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                                    Changed <span className="font-semibold text-slate-700 capitalize">{key}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
