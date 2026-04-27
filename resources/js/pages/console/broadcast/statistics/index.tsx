import { PageContainer, Section, SectionTitle } from '@/components/container';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import { ConsoleLayout } from '@/layouts/console-layout';
import { VisitChart } from '@/pages/console/broadcast/statistics/components/charts';
import { RoomTimeRange } from '@/pages/console/broadcast/statistics/components/ranges';
import { LiveEvent, LiveRoomStat } from '@/services/model';
import { usePoll } from '@inertiajs/react';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { RoomSelect } from '../components/rooms';
import { EventIndex } from './components/events';

export default function StatisticsPage({
  events,
  data,
}: {
  events: LiveEvent[];
  data: LiveRoomStat[];
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
        breadcrumb={[{ label: '观看数据', link: route('broadcast.statistics') }]}
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
        <Section title={<SectionTitle title="直播间数据" actions={[<RoomTimeRange />]} />}>
          <VisitChart data={data} />
        </Section>
        <Separator />
        <EventIndex data={events} />
      </PageContainer>
    </ConsoleLayout>
  );
}
