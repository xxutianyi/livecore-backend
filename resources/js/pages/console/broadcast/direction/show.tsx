import { PageContainer } from '@/components/container';
import { Separator } from '@/components/ui/separator';
import { useReview } from '@/hooks/use-review';
import { ConsoleLayout } from '@/layouts/console-layout';
import { LiveEvent, LiveMessage } from '@/services/model';
import { RoomSelect } from '../components/rooms';
import { Configs } from './components/configs';
import { MessageReview } from './components/messages';
import { ObsController } from './components/obs';
import { Preview } from './components/preview';

export default function ShowEvent({
  event,
  messages,
}: {
  event: LiveEvent;
  messages: LiveMessage[];
}) {
  useReview(event.id);

  return (
    <ConsoleLayout>
      <PageContainer
        title="开始直播"
        breadcrumb={[
          { label: '开始直播', link: route('broadcast.direction') },
          { label: event.name, link: route('broadcast.direction.show', [event.room_id, event.id]) },
        ]}
        actions={[<RoomSelect route={route('broadcast.direction')} key="select" />]}
      >
        <Preview event={event} />
        <Separator />
        <ObsController event={event} />
        <Separator />
        <MessageReview messages={messages} />
        <Separator />
        <Configs event={event} />
      </PageContainer>
    </ConsoleLayout>
  );
}
