import { Separator } from '@/components/ui/separator';
import { PageContainer } from '@/components/winglab/layout';
import { AdminLayout } from '@/layouts/admin-layout';
import { RoomSelect } from '@/pages/console/broadcast/partial/room-select';
import { LiveEvent, LiveRoom } from '@/services/model';
import { EventCreate, EventHistory } from './partial/events';

export default function CreateEvent({ room, events }: { room: LiveRoom; events: LiveEvent[] }) {
    return (
        <AdminLayout>
            <PageContainer
                title="开始直播"
                actions={[<RoomSelect route={route('broadcast.direction')} key="select" />]}
            >
                <EventCreate room={room} />
                <Separator />
                <EventHistory events={events} />
            </PageContainer>
        </AdminLayout>
    );
}
