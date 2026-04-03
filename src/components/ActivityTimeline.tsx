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
            <div className="flex items-center gap-2 text-[#E1E1E1]/70">
                <Clock size={16} />
                <h3 className="text-sm font-black uppercase tracking-widest">Activity Timeline</h3>
            </div>

            <div className="relative pl-5 ml-2">
                {/* Continuous Line */}
                <div className="absolute top-2 bottom-0 left-[1px] w-[2px] bg-gradient-to-b from-white/20 via-white/10 to-transparent" />

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
                            <div className="absolute -left-[24px] top-1.5 w-2.5 h-2.5 rounded-full border border-white/30 bg-white/20 group-hover:bg-[#00F2FE] group-hover:scale-150 transition-all duration-300" />
                            
                            <div className="space-y-1 bg-[#0A0A0A] p-3 rounded-xl border border-white/10 group-hover:border-white/20 transition-colors">
                                <p className="text-sm font-bold text-[#E1E1E1]">{log.action}</p>
                                <p className="text-[10px] text-[#E1E1E1]/60 font-medium font-mono">
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
                        <div className="absolute -left-[24px] top-3.5 w-2.5 h-2.5 rounded-full border border-white/30 bg-white/10" />
                        <p className="text-xs text-[#E1E1E1]/60 italic bg-[#0A0A0A] p-3 rounded-xl inline-block border border-white/10">No activity recorded yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
