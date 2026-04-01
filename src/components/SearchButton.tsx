'use client';

import { Search } from 'lucide-react';

export default function SearchButton() {
    return (
        <button 
            onClick={() => { if (typeof window !== 'undefined') window.dispatchEvent(new Event('open-search')); }} 
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
        >
            <Search size={20} />
            <span className="text-[9px] font-bold uppercase tracking-widest">Search</span>
        </button>
    );
}
