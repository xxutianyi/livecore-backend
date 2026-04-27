import { PageContainer } from '@/components/container';
import { Separator } from '@/components/ui/separator';
import { AdminLayout } from '@/layouts/admin-layout';
import { LiveEvent, LiveRoom } from '@/services/model';
import { RoomSelect } from '../room-select';
import Welcome from '../welcome';
import { EventCreate, EventHistory } from './partial/events';

export default function CreateEvent({ room, events }: { room?: LiveRoom; events: LiveEvent[] }) {
    if (!room) return <Welcome />;

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
