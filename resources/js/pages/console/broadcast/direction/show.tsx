import { Separator } from '@/components/ui/separator';
import { PageContainer } from '@/components/winglab/layout';
import { useReview } from '@/hooks/use-review';
import { AdminLayout } from '@/layouts/admin-layout';
import { ObsController } from '@/pages/console/broadcast/partial/obs';
import { RoomSelect } from '@/pages/console/broadcast/partial/room-select';
import { StreamingConfig, StreamingMessage, StreamingPlay } from '@/pages/console/broadcast/partial/streaming';
import { LiveEvent, LiveMessage } from '@/services/model';

export default function ShowEvent({ event, messages: initMessages }: { event: LiveEvent; messages: LiveMessage[] }) {
    const { users, messages } = useReview(event.id, initMessages);

    return (
        <AdminLayout>
            <PageContainer
                title="开始直播"
                actions={[<RoomSelect route={route('broadcast.direction')} key="select" />]}
            >
                <Separator />
                <StreamingPlay event={event} />
                <ObsController event={event} />
                <Separator />
                <StreamingMessage messages={messages} />
                <Separator />
                <StreamingConfig event={event} />
            </PageContainer>
        </AdminLayout>
    );
}
