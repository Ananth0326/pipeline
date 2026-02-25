import type { Metadata } from 'next';
import { Outfit, Inter, Roboto_Mono } from 'next/font/google';
import { Plus, LayoutDashboard, Search } from 'lucide-react';
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
            <body className="antialiased min-h-screen bg-white dark:bg-black font-sans">
                {/* TOP NAV - Optimized for mobile */}
                <nav className="border-b border-gray-100 dark:border-gray-900 px-6 md:px-8 py-4 flex justify-between items-center bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-40">
                    <h1 className="text-xl font-black tracking-tighter font-outfit">PIPELINE</h1>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-4">
                        <a href="/dashboard" className="text-[10px] font-black uppercase tracking-widest hover:text-blue-600 transition-colors">Dashboard</a>
                        <a
                            href="/add-company"
                            className="bg-[#66D19E] hover:bg-[#58C28E] text-[#064E3B] px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border border-[#4FB886]"
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
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-black/90 backdrop-blur-lg border-t border-gray-100 dark:border-gray-900 px-6 py-3 pb-8 flex justify-around items-center z-40">
                    <a href="/dashboard" className="flex flex-col items-center gap-1 text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                        <LayoutDashboard size={20} />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Home</span>
                    </a>

                    {/* Central Add Button for Mobile */}
                    <a href="/add-company" className="w-12 h-12 bg-[#66D19E] rounded-2xl flex items-center justify-center text-[#064E3B] shadow-xl shadow-green-500/40 hover:scale-110 active:scale-90 transition-all -translate-y-4 border-4 border-white dark:border-black">
                        <LayoutDashboard size={20} className="hidden" /> {/* Placeholder for logic if needed */}
                        <Plus size={24} strokeWidth={3} />
                    </a>

                    <a href="/dashboard" className="flex flex-col items-center gap-1 text-gray-400 opacity-30 cursor-not-allowed">
                        <Search size={20} />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Search</span>
                    </a>
                </nav>
            </body>
        </html>
    );
}
