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

const COLUMNS = [
    { id: 'applied', title: 'Applied', icon: <FileText size={16} />, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
    { id: 'assessment', title: 'Assessment', icon: <Clock size={16} />, color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' },
    { id: 'interview', title: 'Interview', icon: <Briefcase size={16} />, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
    { id: 'offer', title: 'Offer', icon: <CheckCircle2 size={16} />, color: 'text-green-500 bg-green-50 dark:bg-green-900/20' },
    { id: 'rejected', title: 'Rejected', icon: <XCircle size={16} />, color: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
];

interface KanbanBoardProps {
    companies: Company[];
}

export default function KanbanBoard({ companies: initialCompanies }: KanbanBoardProps) {
    const [companies, setCompanies] = useState<Company[]>(initialCompanies);
    const [activeId, setActiveId] = useState<string | null>(null);
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

    const handleDragEnd = async (event: DragEndEvent) => {
        setActiveId(null);
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
            const company = companies.find(c => c.id === activeCompanyId);
            if (company && getColumnForStatus(company.status) !== targetColumn) {
                
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

    return (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-8 items-start snap-x h-[70vh] minimal-scrollbar">
                {COLUMNS.map((col) => {
                    const columnCompanies = companies.filter(c => getColumnForStatus(c.status) === col.id);
                    return (
                        <div key={col.id} className="min-w-[300px] w-[300px] flex flex-col bg-gray-50/50 dark:bg-[#0a0a0a] rounded-2xl border border-gray-100 dark:border-gray-800 shrink-0 snap-center max-h-full">
                            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-gray-50/50 dark:bg-black/50 backdrop-blur-md rounded-t-2xl z-10">
                                <div className="flex items-center gap-2">
                                    <span className={`p-1.5 rounded-lg ${col.color}`}>{col.icon}</span>
                                    <h3 className="font-outfit font-black tracking-tighter uppercase">{col.title}</h3>
                                </div>
                                <span className="text-[10px] font-mono bg-white dark:bg-black border border-gray-200 dark:border-gray-800 px-2 py-1 rounded-md text-gray-500">
                                    {columnCompanies.length}
                                </span>
                            </div>
                            
                            <KanbanColumn id={col.id} companies={columnCompanies} />
                        </div>
                    );
                })}
            </div>

            <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }) }}>
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
            <div ref={setNodeRef} style={style} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 opacity-50" />
        );
    }

    const updatedDate = new Date(company.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

    return (
        <motion.div
            layout={!isOverlay}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            ref={setNodeRef}
            style={style}
            onClick={() => !isOverlay && router.push(`/company/${company.id}`)}
            className={`group bg-white dark:bg-[#111] p-4 rounded-xl shadow-sm border ${isOverlay ? 'border-blue-400 rotate-2 shadow-xl cursor-grabbing' : 'border-gray-100 dark:border-gray-800 cursor-pointer hover:border-gray-300 dark:hover:border-gray-600'} transition-colors relative flex flex-col gap-3`}
        >
            <div className="flex justify-between items-start gap-2">
                <div>
                    <h4 className="font-inter font-bold text-gray-900 dark:text-gray-100 text-sm leading-tight">{company.company_name}</h4>
                    <p className="font-mono text-[10px] text-gray-500 mt-1 truncate max-w-[180px]">{company.role_title}</p>
                </div>
                <button
                    {...attributes}
                    {...listeners}
                    onClick={(e) => e.stopPropagation()}
                    className={`p-1.5 text-gray-300 hover:text-gray-600 dark:hover:text-gray-300 rounded cursor-grab active:cursor-grabbing ${isOverlay ? 'cursor-grabbing' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}
                >
                    <GripVertical size={14} />
                </button>
            </div>
            
            <div className="flex justify-between items-center mt-auto">
                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded bg-gray-50 dark:bg-gray-900 text-gray-400 border border-gray-100 dark:border-gray-800">
                    {updatedDate}
                </span>
                {company.next_action && (
                    <span className="text-[9px] truncate max-w-[100px] text-gray-400 font-medium" title={company.next_action}>
                        {company.next_action}
                    </span>
                )}
            </div>
        </motion.div>
    );
}
