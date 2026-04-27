import { PageContainer, Section, SectionTitle } from '@/components/container';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import { ConsoleLayout } from '@/layouts/console-layout';
import { VisitChart } from '@/pages/console/broadcast/statistics/components/charts';
import { EventTimeRange } from '@/pages/console/broadcast/statistics/components/ranges';
import { LiveEvent, LiveEventStat } from '@/services/model';
import { usePoll } from '@inertiajs/react';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { RoomSelect } from '../components/rooms';
import { EventIndex } from './components/events';

export default function StatisticsPage({
  event,
  events,
  data,
}: {
  event: LiveEvent;
  events: LiveEvent[];
  data: LiveEventStat[];
}) {
  const [polling, setPolling] = useState(false);
  const { stop, start } = usePoll(10000, {}, { autoStart: false });

  function togglePolling() {
    setPolling((prevState) => {
      if (prevState) stop();
      if (!prevState) start();
      return !prevState;
    });
  }

  return (
    <ConsoleLayout>
      <PageContainer
        title="观看数据"
        breadcrumb={[
          { label: '观看数据', link: route('broadcast.statistics') },
          {
            label: event.name,
            link: route('broadcast.statistics.show', [event.room_id, event.id]),
          },
        ]}
        actions={[
          <Toggle
            key="refresh"
            variant="outline"
            size="lg"
            onPressedChange={togglePolling}
            pressed={polling}
          >
            <RefreshCw className={polling ? 'animate-spin' : ''} />
            {polling ? '停止刷新' : '自动刷新'}
          </Toggle>,
          <RoomSelect route={route('broadcast.direction')} key="select" />,
        ]}
      >
        <Separator />
        <Section title={<SectionTitle title="场次数据" actions={[<EventTimeRange />]} />}>
          <VisitChart data={data} />
        </Section>
        <Separator />
        <EventIndex data={events} />
      </PageContainer>
    </ConsoleLayout>
  );
}
