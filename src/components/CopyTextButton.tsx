'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CopyTextButtonProps {
    text: string;
}

export default function CopyTextButton({ text }: CopyTextButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (!text?.trim()) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
        } catch {
            setCopied(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-100 transition-colors"
            title="Copy JD text"
        >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy JD'}
        </button>
    );
}
