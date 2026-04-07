import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

type SavedRoleRow = {
    id: string;
    company_name: string;
    role_title?: string | null;
    job_link: string;
    is_converted?: boolean | null;
    created_at: string;
    updated_at: string;
};

export async function GET() {
    try {
        const supabase = getSupabase();

        let query = supabase
            .from('saved_roles')
            .select('*')
            .eq('is_converted', false)
            .order('updated_at', { ascending: false })
            .limit(1);

        let { data, error } = await query;

        // Graceful fallback for schemas where is_converted does not exist yet.
        if (error && `${error.message}`.toLowerCase().includes('is_converted')) {
            const fallback = await supabase
                .from('saved_roles')
                .select('*')
                .order('updated_at', { ascending: false })
                .limit(1);

            data = fallback.data as SavedRoleRow[] | null;
            error = fallback.error;
        }

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const role = (data?.[0] || null) as SavedRoleRow | null;
        return NextResponse.json({ role });
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || 'Failed to fetch stagnant saved role.' },
            { status: 500 }
        );
    }
}
