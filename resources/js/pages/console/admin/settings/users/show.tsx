import { Separator } from '@/components/ui/separator';
import { PageContainer, SectionHeader } from '@/components/winglab/layout';
import { AdminLayout } from '@/layouts/admin-layout';
import { LiveRoom, User } from '@/services/model';
import { UserDetail } from './partial/user-detail';
import { UserUpdate } from './partial/user-forms';
import { RoomIndex, RoomUpdate } from './partial/user-rooms';

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
                <div>
                    <SectionHeader title="基本信息" />
                    <UserDetail user={user} />
                </div>
                <Separator />
                <div>
                    <SectionHeader title="可管理的直播间" />
                    <RoomIndex user={user} rooms={directable} />
                </div>
            </PageContainer>
        </AdminLayout>
    );
}
