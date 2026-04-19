import { PageContainer } from '@/components/winglab/layout';
import { AdminLayout } from '@/layouts/admin-layout';
import { RoomSelect } from '@/pages/console/broadcast/partial/room-select';
import { LiveRoom } from '@/services/model';
import Welcome from './welcome';

export default function DirectionPage({ room }: { room?: LiveRoom }) {
    console.log(room);

    if (!room) return <Welcome />;

    return (
        <AdminLayout>
            <PageContainer
                title="开始直播"
                actions={[<RoomSelect route={route('broadcast.direction')} key="select" />]}
            >
                <div className="min-h-64 w-full border border-dashed"></div>
            </PageContainer>
        </AdminLayout>
    );
}
