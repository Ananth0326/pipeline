'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import TerminalNotification from './TerminalNotification';

type StagnantSavedRole = {
    id: string;
    company_name: string;
    role_title?: string | null;
};

const FIRST_TRIGGER_HOUR = 15;
const FIRST_TRIGGER_MINUTE = 12;
const REPEAT_MS = 3 * 60 * 60 * 1000;

function msUntilNext1512(now = new Date()) {
    const base = new Date(now);
    base.setHours(FIRST_TRIGGER_HOUR, FIRST_TRIGGER_MINUTE, 0, 0);

    if (now.getTime() < base.getTime()) {
        return base.getTime() - now.getTime();
    }

    const diff = now.getTime() - base.getTime();
    const elapsedWindows = Math.floor(diff / REPEAT_MS) + 1;
    const nextSlot = new Date(base.getTime() + elapsedWindows * REPEAT_MS);
    return nextSlot.getTime() - now.getTime();
}

function playTerminalPing() {
    try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;

        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1568, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1245, ctx.currentTime + 0.09);

        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.13);
    } catch {
        // Ignore autoplay/audio context restrictions.
    }
}

export default function SavedRoleNotifier() {
    const router = useRouter();
    const [role, setRole] = useState<StagnantSavedRole | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const hasRole = useMemo(() => !!role?.id, [role]);

    const closeNotification = () => setIsOpen(false);

    const fetchStagnantRole = async () => {
        try {
            const res = await fetch('/api/saved-roles/stagnant', { cache: 'no-store' });
            const data = await res.json();

            if (!res.ok) {
                console.error('Stagnant role fetch failed:', data?.error || res.statusText);
                return;
            }

            const nextRole = (data?.role || null) as StagnantSavedRole | null;
            if (!nextRole?.id) return;

            setRole(nextRole);
            setIsOpen(true);
            playTerminalPing();
        } catch (error) {
            console.error('Stagnant role check failed:', error);
        }
    };

    useEffect(() => {
        const waitMs = msUntilNext1512();

        timeoutRef.current = setTimeout(() => {
            fetchStagnantRole();
            intervalRef.current = setInterval(fetchStagnantRole, REPEAT_MS);
        }, waitMs);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'Space') {
                event.preventDefault();
                if (role?.id) {
                    const params = new URLSearchParams({
                        company: role.company_name,
                        savedRoleId: role.id,
                    });
                    if (role.role_title) {
                        params.set('roleTitle', role.role_title);
                    }
                    router.push(`/add-company?${params.toString()}`);
                    setIsOpen(false);
                }
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen, role, router]);

    if (!hasRole) return null;

    return (
        <TerminalNotification
            isOpen={isOpen}
            companyName={role?.company_name || ''}
            roleTitle={role?.role_title || ''}
            onApplyNow={() => {
                if (!role?.id) return;
                const params = new URLSearchParams({
                    company: role.company_name,
                    savedRoleId: role.id,
                });
                if (role.role_title) {
                    params.set('roleTitle', role.role_title);
                }
                router.push(`/add-company?${params.toString()}`);
                setIsOpen(false);
            }}
            onSkip={closeNotification}
        />
    );
}
