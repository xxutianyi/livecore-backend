import { PageContainer } from '@/components/container';
import { Separator } from '@/components/ui/separator';
import { useReview } from '@/hooks/use-review';
import { AdminLayout } from '@/layouts/admin-layout';
import { LiveEvent, LiveMessage } from '@/services/model';
import { RoomSelect } from '../room-select';
import { ObsController } from './partial/obs';
import { MessageReview, StreamingConfig, StreamingPlay } from './partial/streaming';

export default function ShowEvent({ event, messages }: { event: LiveEvent; messages: LiveMessage[] }) {
    useReview(event.id);

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
                <MessageReview messages={messages} />
                <Separator />
                <StreamingConfig event={event} />
            </PageContainer>
        </AdminLayout>
    );
}
