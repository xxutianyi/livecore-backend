import { PageContainer } from '@/components/container';
import { Separator } from '@/components/ui/separator';
import { ConsoleLayout } from '@/layouts/console-layout';
import { EventCreate, EventHistory } from '@/pages/console/broadcast/direction/components/events';
import { LiveEvent, LiveRoom } from '@/services/model';
import { RoomSelect } from '../components/rooms';

export default function CreateEvent({ room, events }: { room: LiveRoom; events: LiveEvent[] }) {
  return (
    <ConsoleLayout>
      <PageContainer
        title="开始直播"
        breadcrumb={[{ label: '开始直播', link: route('broadcast.direction') }]}
        actions={[<RoomSelect route={route('broadcast.direction')} key="select" />]}
      >
        <EventCreate room={room} />
        <Separator />
        <EventHistory events={events} />
      </PageContainer>
    </ConsoleLayout>
  );
}
