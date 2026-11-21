import { Suspense } from "react";
import { adminGetUsers } from "@/lib/api";
import { AdminUsersTable } from "@/components/admin/users-table";

async function UsersContent() {
    const users = await adminGetUsers();
    return <AdminUsersTable users={users} />;
}

export default function AdminUsersPage() {
    return (
        <div>
            <h1 className="heading-3 mb-8">All Users</h1>
            <Suspense fallback={<div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-12 animate-pulse bg-ink/5"/>)}</div>}>
                <UsersContent />
            </Suspense>
        </div>
    );
}
