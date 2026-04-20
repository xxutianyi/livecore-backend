import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PageContainer } from '@/components/winglab/layout';
import { AdminLayout } from '@/layouts/admin-layout';
import { RoomDetail } from '@/pages/console/settings/rooms/partial/detail';
import { LiveRoom, UserGroup } from '@/services/model';
import { Link } from '@inertiajs/react';
import { CoverUpdate, RoomUpdate } from './partial/forms';
import { GroupIndex, GroupUpdate } from './partial/group';

export default function Show({ room, groups }: { room: LiveRoom; groups: UserGroup[] }) {
    return (
        <AdminLayout breadcrumbTitle={room.name}>
            <PageContainer
                title="直播间信息"
                actions={[
                    <RoomUpdate room={room} key="update" />,
                    <CoverUpdate room={room} key="cover" />,
                    <GroupUpdate room={room} groups={groups} key="group" />,
                    <Button asChild key="playback">
                        <Link href={route('broadcast.playbacks', room.id)}>管理回放</Link>
                    </Button>,
                ]}
            >
                <Separator />
                <RoomDetail room={room} />
                <Separator />
                <GroupIndex groups={groups} />
            </PageContainer>
        </AdminLayout>
    );
}
