import type { Metadata } from 'next';
import './globals.css';

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
        <html lang="en">
            <body className="antialiased min-h-screen">
                <nav className="border-b px-8 py-4 flex justify-between items-center bg-white dark:bg-black sticky top-0 z-10">
                    <h1 className="text-xl font-bold tracking-tight">PIPELINE</h1>
                    <div className="space-x-4">
                        <a href="/dashboard" className="text-sm font-medium hover:underline">Dashboard</a>
                        <a href="/add-company" className="text-sm font-medium hover:underline">Add Application</a>
                    </div>
                </nav>
                <main className="max-w-6xl mx-auto px-8 py-10">
                    {children}
                </main>
            </body>
        </html>
    );
}
