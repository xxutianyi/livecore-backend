import { Separator } from '@/components/ui/separator';
import { PageContainer } from '@/components/winglab/layout';
import { useReview } from '@/hooks/use-review';
import { AdminLayout } from '@/layouts/admin-layout';
import { LiveEvent, LiveMessage } from '@/services/model';
import { RoomSelect } from '../room-select';
import { ObsController } from './partial/obs';
import { StreamingConfig, StreamingMessage, StreamingPlay } from './partial/streaming';

export default function ShowEvent({ event, messages: initMessages }: { event: LiveEvent; messages: LiveMessage[] }) {
    const { messages } = useReview(event.id, initMessages);

    return (
        <AdminLayout breadcrumbTitle={event.name}>
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
