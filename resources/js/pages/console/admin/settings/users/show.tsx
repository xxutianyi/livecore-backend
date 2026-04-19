import { Separator } from '@/components/ui/separator';
import { AdminLayout } from '@/layouts/admin-layout';
import { RoomIndex } from '@/pages/console/admin/settings/users/partial/user-rooms';
import { LiveRoom, User } from '@/services/model';
import { UserDetail } from './partial/user-detail';

export default function Show({ user, directable }: { user: User; directable: LiveRoom[] }) {
    return (
        <AdminLayout breadcrumbTitle={user.name} className="p-4">
            <div className="w-full space-y-4">
                <UserDetail user={user} />
                <Separator />
                <RoomIndex user={user} rooms={directable} />
                <Separator />
            </div>
        </AdminLayout>
    );
}
