import type { Metadata } from 'next';
import { Outfit, Inter, Roboto_Mono } from 'next/font/google';
import { Plus, LayoutDashboard } from 'lucide-react';
import SearchButton from '@/components/SearchButton';
import './globals.css';

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
    display: 'swap',
});

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const mono = Roboto_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Pipeline | Job Tracker',
    description: 'Fast, minimal job application tracker',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${outfit.variable} ${inter.variable} ${mono.variable}`}>
            <body className="antialiased min-h-screen bg-[#0A0A0A] text-[#E1E1E1] font-sans">
                {/* TOP NAV - Optimized for mobile */}
                <nav className="border-b border-white/10 px-6 md:px-8 py-4 flex justify-between items-center bg-[#0A0A0A]/90 backdrop-blur-md sticky top-0 z-40">
                    <h1 className="text-xl font-black tracking-tighter font-outfit">PIPELINE</h1>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-4">
                        <a href="/dashboard" className="text-[10px] font-black uppercase tracking-widest text-[#E1E1E1] hover:text-[#00F2FE] transition-colors">Dashboard</a>
                        <a
                            href="/add-company"
                            className="bg-black hover:bg-[#111111] text-[#E1E1E1] px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border border-white/10 shadow-lg shadow-emerald-500/50"
                        >
                            <Plus size={14} strokeWidth={3} />
                            Add Application
                        </a>
                    </div>
                </nav>

                <main className="max-w-6xl mx-auto px-6 md:px-8 py-6 md:py-10 pb-24 md:pb-10">
                    {children}
                </main>

                {/* MOBILE BOTTOM NAV */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0A0A0A]/95 backdrop-blur-lg border-t border-white/10 px-6 py-3 pb-8 flex justify-around items-center z-40">
                    <a href="/dashboard" className="flex flex-col items-center gap-1 text-[#E1E1E1]/70 hover:text-[#00F2FE] transition-colors">
                        <LayoutDashboard size={20} />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Home</span>
                    </a>

                    {/* Central Add Button for Mobile */}
                    <a href="/add-company" className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-[#E1E1E1] shadow-xl shadow-emerald-500/50 hover:scale-110 active:scale-90 transition-all -translate-y-4 border border-white/10">
                        <LayoutDashboard size={20} className="hidden" /> {/* Placeholder for logic if needed */}
                        <Plus size={24} strokeWidth={3} />
                    </a>

                    <SearchButton />
                </nav>
            </body>
        </html>
    );
}
