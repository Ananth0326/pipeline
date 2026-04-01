'use client';

import { AppLog } from '@/lib/types';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

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

            <div className="relative pl-5 ml-2">
                {/* Continuous Line */}
                <div className="absolute top-2 bottom-0 left-[1px] w-[2px] bg-gradient-to-b from-gray-200 via-gray-100 to-transparent dark:from-gray-800 dark:via-gray-900 dark:to-transparent" />

                <div className="space-y-6">
                    {logs.map((log, index) => (
                        <motion.div 
                            key={log.id} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                            className="relative group"
                        >
                            {/* Timeline Dot */}
                            <div className="absolute -left-[24px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-black bg-gray-300 dark:bg-gray-600 group-hover:bg-blue-500 group-hover:scale-150 transition-all duration-300 shadow-sm" />
                            
                            <div className="space-y-1 bg-gray-50/50 dark:bg-gray-900/20 p-3 rounded-xl border border-transparent group-hover:border-gray-100 dark:group-hover:border-gray-800 transition-colors">
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{log.action}</p>
                                <p className="text-[10px] text-gray-400 font-medium font-mono">
                                    {new Date(log.created_at).toLocaleString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
                
                {logs.length === 0 && (
                    <div className="relative pt-2">
                        <div className="absolute -left-[24px] top-3.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-black bg-gray-200 dark:bg-gray-800" />
                        <p className="text-xs text-gray-500 italic bg-gray-50/50 dark:bg-gray-900/20 p-3 rounded-xl inline-block">No activity recorded yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
