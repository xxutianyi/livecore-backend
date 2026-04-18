import { Separator } from '@/components/ui/separator';
import { AdminLayout } from '@/layouts/admin-layout';
import { User } from '@/services/model';
import { UserDetail } from './partial/user-detail';

export default function Show({ user }: { user: User }) {
    return (
        <AdminLayout breadcrumbTitle={user.name} className="p-4">
            <div className="w-full space-y-4">
                <UserDetail user={user} />
                <Separator />
                <Separator />
            </div>
        </AdminLayout>
    );
}
