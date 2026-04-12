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
    title: 'Pipeline Mastery | Job Tracking Dashboard',
    description: 'Stunning glassmorphism job pipeline dashboard to track applications from applied to offer.',
    keywords: ['job pipeline', 'application tracker', 'interview dashboard', 'career workflow'],
    openGraph: {
        title: 'Pipeline Mastery Dashboard',
        description: 'Track every hiring stage with elegant visuals, progress rings, and motion-rich cards.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Pipeline Mastery Dashboard',
        description: 'Modern glassmorphism job pipeline tracker with Framer Motion and TailwindCSS.',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${outfit.variable} ${inter.variable} ${mono.variable}`}>
            <body className="antialiased min-h-screen font-sans">
                <header className="fixed inset-x-0 top-0 z-50">
                    <nav className="premium-card mx-auto mt-4 flex w-[min(1220px,94%)] items-center justify-between bg-white/90 px-4 py-3 backdrop-blur md:px-6">
                        <div className="flex items-center gap-4">
                            <a href="/dashboard" className="text-sm font-black tracking-[0.18em] text-[#1C1917]">PIPELINE</a>
                            <div className="hidden items-center gap-4 md:flex">
                                <a href="/dashboard" className="text-sm font-medium text-[#1C1917] hover:text-black">Dashboard</a>
                                <a href="/add-company" className="text-sm font-medium text-[#78716C] hover:text-[#1C1917]">Saved Workflow</a>
                            </div>
                        </div>
                        <a
                            href="/add-company"
                            className="inline-flex items-center gap-2 rounded-xl bg-[#1C1917] px-4 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-white hover:bg-black transition-colors"
                        >
                            <Plus size={14} />
                            Add Application
                        </a>
                    </nav>
                </header>
                {children}
            </body>
        </html>
    );
}
