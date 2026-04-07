'use client';

import { Company, ApplicationStatus } from '@/lib/types';
import { updateCompany } from '@/lib/actions';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
    DragOverEvent,
    DragOverlay,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, Clock, CheckCircle2, XCircle, FileText, Briefcase } from 'lucide-react';
import confetti from 'canvas-confetti';

const playThudSound = () => {
    try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        const audioCtx = new AudioContextClass();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

        gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
        // Ignore audio playback errors if user hasn't interacted with document
    }
};

const COLUMNS = [
    { 
        id: 'applied', 
        title: 'Applied', 
        icon: <FileText size={16} />, 
        color: 'text-[#00F2FE] bg-[#00F2FE]/20 border border-[#00F2FE]/40', 
        glow: '',
        titleClass: 'text-[#00F2FE]' 
    },
    { 
        id: 'assessment', 
        title: 'Assessment', 
        icon: <Clock size={16} />, 
        color: 'text-[#FFB800] bg-[#FFB800]/20 border border-[#FFB800]/40', 
        glow: '',
        titleClass: 'text-[#FFB800]'
    },
    { 
        id: 'interview', 
        title: 'Interview', 
        icon: <Briefcase size={16} />, 
        color: 'text-[#A16EFF] bg-[#A16EFF]/20 border border-[#A16EFF]/40', 
        glow: '',
        titleClass: 'text-[#A16EFF]'
    },
    { 
        id: 'offer', 
        title: 'Offer', 
        icon: <CheckCircle2 size={16} />, 
        color: 'text-[#00E676] bg-[#00E676]/20 border border-[#00E676]/40 shadow-[0_0_16px_rgba(0,230,118,0.35)]', 
        glow: 'shadow-[0_0_26px_rgba(0,230,118,0.25)]',
        titleClass: 'text-[#00E676]'
    },
    { 
        id: 'rejected', 
        title: 'Rejected', 
        icon: <XCircle size={16} />, 
        color: 'text-[#FF1744] bg-[#FF1744]/20 border border-[#FF1744]/40', 
        glow: '',
        titleClass: 'text-[#FF1744]'
    },
];

interface KanbanBoardProps {
    companies: Company[];
}

export default function KanbanBoard({ companies: initialCompanies }: KanbanBoardProps) {
    const [companies, setCompanies] = useState<Company[]>(initialCompanies);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [overId, setOverId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        setCompanies(initialCompanies);
    }, [initialCompanies]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor)
    );

    const getColumnForStatus = (status: string) => {
        if (status === 'selected') return 'interview';
        if (COLUMNS.find(c => c.id === status)) return status;
        return 'applied';
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { over } = event;
        setOverId(over ? (over.id as string) : null);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        setActiveId(null);
        setOverId(null);
        const { active, over } = event;
        if (!over) return;

        const activeCompanyId = active.id as string;
        const overId = over.id as string;
        
        // Find which column it was dropped into.
        // It could be dropped on a column container directly, or over another card.
        let targetColumn = COLUMNS.find(c => c.id === overId)?.id;
        
        if (!targetColumn) {
            const overCompany = companies.find(c => c.id === overId);
            if (overCompany) {
                targetColumn = getColumnForStatus(overCompany.status);
            }
        }

        if (targetColumn) {
            playThudSound();

            const company = companies.find(c => c.id === activeCompanyId);
            if (company && getColumnForStatus(company.status) !== targetColumn) {
                if (targetColumn === 'offer') {
                    confetti({
                        particleCount: 150,
                        spread: 80,
                        origin: { y: 0.6 },
                        colors: ['#10B981', '#34D399', '#A7F3D0'],
                        disableForReducedMotion: true
                    });
                }
                
                // Map column ID to rich UI textual statuses
                const statusDetails: Record<string, { text: string, color: 'blue' | 'orange' | 'purple' | 'green' | 'red' }> = {
                    'applied': { text: 'Applied', color: 'blue' },
                    'assessment': { text: 'Assessment', color: 'orange' },
                    'interview': { text: 'Interview', color: 'purple' },
                    'offer': { text: 'Offer', color: 'green' },
                    'rejected': { text: 'Rejected', color: 'red' }
                };
                
                const newDetails = statusDetails[targetColumn] || { text: targetColumn, color: 'blue' };

                // Optimistic UI Update
                setCompanies(prev => prev.map(c => 
                    c.id === activeCompanyId ? { 
                        ...c, 
                        status: targetColumn as ApplicationStatus,
                        status_text: newDetails.text,
                        status_color: newDetails.color
                    } : c
                ));
                
                // Server Update
                try {
                    await updateCompany(
                        activeCompanyId, 
                        { 
                            status: targetColumn as ApplicationStatus,
                            status_text: newDetails.text,
                            status_color: newDetails.color
                        }, 
                        `Moved to ${newDetails.text}`
                    );
                } catch (error) {
                    console.error('Failed to move company:', error);
                    // Revert on failure
                    setCompanies(initialCompanies);
                }
            }
        }
    };

    const activeCompany = activeId ? companies.find(c => c.id === activeId) : null;

    const hoveredColumnId = (() => {
        if (!overId) return null;
        if (COLUMNS.find(c => c.id === overId)) return overId;
        const overCompany = companies.find(c => c.id === overId);
        if (overCompany) return getColumnForStatus(overCompany.status);
        return null;
    })();

    return (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
            <div className="relative w-full">
                {/* Background Interactive Orbs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-between px-[5%] opacity-40 dark:opacity-100 transition-opacity">
                    <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ ease: "linear", duration: 40, repeat: Infinity }}
                        className="w-[400px] h-[400px] bg-blue-500/20 dark:bg-blue-600/20 rounded-full blur-[100px] mix-blend-screen -translate-y-20 -translate-x-20"
                    />
                    <motion.div 
                        initial={{ opacity: 0.2, scale: 1 }}
                        animate={{ 
                            scale: hoveredColumnId === 'offer' ? 1.4 : 1,
                            opacity: hoveredColumnId === 'offer' ? 0.6 : 0.2
                        }}
                        transition={{ duration: 0.8 }}
                        className="w-[500px] h-[500px] bg-emerald-500/20 dark:bg-emerald-600/20 rounded-full blur-[120px] mix-blend-screen translate-y-10 translate-x-20"
                    />
                </div>

                <div className="flex gap-4 overflow-x-auto pb-8 items-start snap-x h-[70vh] minimal-scrollbar relative z-10 w-full">
                    {COLUMNS.map((col) => {
                        const columnCompanies = companies.filter(c => getColumnForStatus(c.status) === col.id);
                        const isMagneticHovered = activeId !== null && hoveredColumnId === col.id;
                        
                        return (
                            <motion.div 
                                key={col.id} 
                                animate={{ scale: isMagneticHovered ? 1.02 : 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className={`relative min-w-[300px] w-[300px] flex flex-col bg-[#161616]/85 backdrop-blur-[12px] rounded-2xl border ${isMagneticHovered ? 'border-white/20' : 'border-white/5'} shrink-0 snap-center max-h-full ${col.glow}`}
                            >
                                {/* Subtle Radial Gradient Background for Active/Hover State */}
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
                                <div className="p-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#161616]/85 backdrop-blur-md rounded-t-2xl z-10">
                                    <div className="flex items-center gap-2">
                                        <span className={`p-1.5 rounded-lg ${col.color}`}>{col.icon}</span>
                                        <h3 className={`font-outfit font-black tracking-tighter uppercase ${col.titleClass}`}>{col.title}</h3>
                                    </div>
                                    <span className="text-[10px] font-mono bg-[#0A0A0A] border border-white/10 px-2 py-1 rounded-md text-[#E1E1E1]/70">
                                        {columnCompanies.length}
                                    </span>
                                </div>
                                
                                <KanbanColumn id={col.id} companies={columnCompanies} />
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <DragOverlay 
                dropAnimation={{ 
                    duration: 400,
                    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }) 
                }}
            >
                {activeCompany ? <KanbanCard company={activeCompany} isOverlay /> : null}
            </DragOverlay>
        </DndContext>
    );
}

function KanbanColumn({ id, companies }: { id: string, companies: Company[] }) {
    const { setNodeRef } = useSortable({ id, data: { type: 'Column' } });
    
    return (
        <div ref={setNodeRef} className="p-3 flex-1 overflow-y-auto space-y-3 min-h-[150px]">
            <SortableContext items={companies.map(c => c.id)} strategy={verticalListSortingStrategy}>
                <AnimatePresence>
                    {companies.map(company => (
                        <KanbanCard key={company.id} company={company} />
                    ))}
                </AnimatePresence>
            </SortableContext>
        </div>
    );
}

function KanbanCard({ company, isOverlay = false }: { company: Company, isOverlay?: boolean }) {
    const router = useRouter();
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: company.id,
        data: { type: 'Company', company }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    if (isDragging && !isOverlay) {
        return (
            <div ref={setNodeRef} style={style} className="h-24 bg-[#0A0A0A] rounded-xl border border-dashed border-white/25 opacity-50" />
        );
    }

    const updatedDate = new Date(company.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    const hoverShadowMap: Record<string, string> = {
        blue: 'hover:shadow-[0_14px_28px_rgba(0,242,254,0.15)]',
        yellow: 'hover:shadow-[0_14px_28px_rgba(0,242,254,0.15)]',
        orange: 'hover:shadow-[0_14px_28px_rgba(255,184,0,0.15)]',
        purple: 'hover:shadow-[0_14px_28px_rgba(161,110,255,0.15)]',
        green: 'hover:shadow-[0_14px_28px_rgba(0,230,118,0.15)]',
        red: 'hover:shadow-[0_14px_28px_rgba(255,23,68,0.15)]',
    };
    const hoverShadowClass = hoverShadowMap[company.status_color] || hoverShadowMap.yellow;

    return (
        <motion.div
            layout={!isOverlay}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
                opacity: 1, 
                scale: isOverlay ? 1.05 : 1,
                rotate: isOverlay ? 5 : 0 
            }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={(e) => {
                if (!isDragging && !isOverlay) {
                    router.push(`/company/${company.id}`);
                }
            }}
            className={`group bg-[#161616] backdrop-blur-[12px] p-4 rounded-xl border touch-none select-none ${isOverlay ? 'border-[#00E676]/50 shadow-[0_10px_30px_rgba(0,0,0,0.3)] cursor-grabbing z-50' : `border-white/5 hover:border-white/30 ${hoverShadowClass} cursor-grab`} transition-all relative flex flex-col gap-3`}
        >
            <div className="flex justify-between items-start gap-2">
                <div>
                    <h4 className="font-inter font-bold text-[#E1E1E1] text-sm leading-tight">{company.company_name}</h4>
                    <p className="font-mono text-[10px] text-[#E1E1E1]/65 mt-1 truncate max-w-[180px]">{company.role_title}</p>
                </div>
            </div>
            
            <div className="flex justify-between items-center mt-auto">
                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded bg-[#0A0A0A] text-[#E1E1E1]/60 border border-white/10">
                    {updatedDate}
                </span>
                {company.next_action && (
                    <span className="text-[9px] truncate max-w-[100px] text-[#E1E1E1]/60 font-medium" title={company.next_action}>
                        {company.next_action}
                    </span>
                )}
            </div>
        </motion.div>
    );
}
