import { Breadcrumb } from '@/components/breadcrumb';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { EventCardList } from '@/components/watch';
import { WebsiteLayout } from '@/layouts/website-layout';
import { LiveEvent, LiveRoom } from '@/services/model';
import { Info } from 'lucide-react';

export default function Events({ room, events }: { room: LiveRoom; events: LiveEvent[] }) {
  const breadcrumbItem = [
    {
      label: '全部直播间',
      link: route('rooms.index'),
    },
    {
      label: room.name,
      link: route('rooms.show', room.id),
    },
    {
      label: '直播回放',
    },
  ];
  return (
    <WebsiteLayout title="直播回放">
      <Breadcrumb className="mb-4 px-2 md:mb-8" items={breadcrumbItem} />
      {events.length > 0 ? (
        <div className="grid gap-x-4 gap-y-8 md:grid-cols-4">
          <EventCardList events={events} />
        </div>
      ) : (
        <Empty className="mx-auto max-w-7xl border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Info />
            </EmptyMedia>
            <EmptyTitle>暂无可查看的回放</EmptyTitle>
          </EmptyHeader>
        </Empty>
      )}
    </WebsiteLayout>
  );
}
