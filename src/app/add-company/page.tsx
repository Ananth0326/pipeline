import AddCompanyClient from '@/components/AddCompanyClient';

export default async function AddCompanyPage({
    searchParams
}: {
    searchParams: Promise<{ company?: string; roleTitle?: string; savedRoleId?: string }>;
}) {
    const params = await searchParams;

    return (
        <AddCompanyClient
            initialCompanyName={params.company}
            initialRoleTitle={params.roleTitle}
            savedRoleId={params.savedRoleId}
        />
    );
}
