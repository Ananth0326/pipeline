import type { Metadata } from 'next';
import { Outfit, Inter, Roboto_Mono } from 'next/font/google';
import { Plus } from 'lucide-react';
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
                <nav className="border-b border-gray-100 dark:border-gray-900 px-8 py-4 flex justify-between items-center bg-white dark:bg-black sticky top-0 z-10">
                    <h1 className="text-xl font-black tracking-tighter font-outfit">PIPELINE</h1>
                    <div className="flex items-center gap-4">
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
                <main className="max-w-6xl mx-auto px-8 py-10">
                    {children}
                </main>
            </body>
        </html>
    );
}
