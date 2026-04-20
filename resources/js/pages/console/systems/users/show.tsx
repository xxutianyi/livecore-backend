import { Separator } from '@/components/ui/separator';
import { PageContainer } from '@/components/winglab/layout';
import { AdminLayout } from '@/layouts/admin-layout';
import { LiveRoom, User } from '@/services/model';
import { UserDetail } from './partial/detail';
import { UserUpdate } from './partial/forms';
import { RoomIndex, RoomUpdate } from './partial/rooms';

export default function Show({ user, directable }: { user: User; directable: LiveRoom[] }) {
    return (
        <AdminLayout breadcrumbTitle={user.name}>
            <PageContainer
                title="管理员信息"
                actions={[
                    <UserUpdate user={user} key="update" />,
                    <RoomUpdate user={user} rooms={directable} key="directable" />,
                ]}
            >
                <Separator />
                <UserDetail user={user} />
                <Separator />
                <RoomIndex user={user} rooms={directable} />
            </PageContainer>
        </AdminLayout>
    );
}
