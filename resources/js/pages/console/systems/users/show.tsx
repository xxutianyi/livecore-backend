import { PageContainer } from '@/components/container';
import { Separator } from '@/components/ui/separator';
import { AdminLayout } from '@/layouts/admin-layout';
import { User } from '@/services/model';
import { UserDetail } from './partial/detail';
import { UserUpdate } from './partial/forms';
import { RoomIndex, RoomUpdate } from './partial/rooms';

export default function Show({ user }: { user: User }) {
    return (
        <AdminLayout breadcrumbTitle={user.name}>
            <PageContainer
                title="管理员信息"
                actions={[<UserUpdate user={user} key="update" />, <RoomUpdate user={user} key="manageable" />]}
            >
                <Separator />
                <UserDetail user={user} />
                <Separator />
                <RoomIndex user={user} />
            </PageContainer>
        </AdminLayout>
    );
}
