import { AppLog } from '@/lib/types';
import { Clock } from 'lucide-react';

interface ActivityTimelineProps {
    logs: AppLog[];
}

export default function ActivityTimeline({ logs }: ActivityTimelineProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-gray-400">
                <Clock size={16} />
                <h3 className="text-sm font-black uppercase tracking-widest">Activity Timeline</h3>
            </div>

            <div className="relative pl-4 space-y-6 border-l border-gray-100 dark:border-gray-800 ml-2">
                {logs.map((log, index) => (
                    <div key={log.id} className="relative">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-black bg-gray-400" />
                        <div className="space-y-0.5">
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{log.action}</p>
                            <p className="text-[10px] text-gray-400 font-medium">
                                {new Date(log.created_at).toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>
                ))}
                {logs.length === 0 && (
                    <p className="text-xs text-gray-500 italic">No activity recorded yet.</p>
                )}
            </div>
        </div>
    );
}
