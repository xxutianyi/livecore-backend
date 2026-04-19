import { PageContainer } from '@/components/winglab/layout';
import { AdminLayout } from '@/layouts/admin-layout';
import { RoomSelect } from '@/pages/console/broadcast/partial/room-select';
import Welcome from '@/pages/console/broadcast/welcome';
import { LiveRoom } from '@/services/model';

export default function StatisticsPage({ room }: { room?: LiveRoom }) {
    if (!room) return <Welcome />;

    return (
        <AdminLayout>
            <PageContainer
                title="观看数据"
                actions={[<RoomSelect route={route('broadcast.direction')} key="select" />]}
            ></PageContainer>
        </AdminLayout>
    );
}
