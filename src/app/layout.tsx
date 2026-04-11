import type { Metadata } from 'next';
import { Outfit, Inter, Roboto_Mono } from 'next/font/google';
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
                {children}
            </body>
        </html>
    );
}
