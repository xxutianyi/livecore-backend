import { Separator } from '@/components/ui/separator';
import { PageContainer } from '@/components/winglab/layout';
import { AdminLayout } from '@/layouts/admin-layout';
import { ObsController } from '@/pages/console/broadcast/partial/obs';
import { LiveEvent, LiveRoom } from '@/services/model';
import { EventCreate, EventHistory } from './partial/events';
import { RoomSelect } from './partial/room-select';
import { StreamingConfig, StreamingMessage, StreamingPlay } from './partial/streaming';
import Welcome from './welcome';

type PageProps = { room?: LiveRoom; event?: LiveEvent; events: LiveEvent[] };

export default function DirectionPage({ room, event, events }: PageProps) {
    if (!room) return <Welcome />;

    return (
        <AdminLayout>
            <PageContainer
                title="开始直播"
                actions={[<RoomSelect route={route('broadcast.direction')} key="select" />]}
            >
                <Separator />
                {event && (
                    <>
                        <StreamingPlay event={event} />
                        <ObsController event={event} />
                        <Separator />
                        <StreamingMessage />
                        <Separator />
                        <StreamingConfig event={event} />
                    </>
                )}
                {!event && (
                    <>
                        <EventCreate room={room} />
                        <Separator />
                        <EventHistory events={events} />
                    </>
                )}
            </PageContainer>
        </AdminLayout>
    );
}
