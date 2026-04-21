import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import { PageContainer } from '@/components/winglab/layout';
import { AdminLayout } from '@/layouts/admin-layout';
import { LiveEvent, LiveEventStat, LiveRoom, LiveRoomStat } from '@/services/model';
import { usePoll } from '@inertiajs/react';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { RoomSelect } from '../room-select';
import Welcome from '../welcome';
import { EventIndex, StatsEvent } from './stats-event';
import { StatsRoom } from './stats-room';

type PageProps = {
    room?: LiveRoom;
    event?: LiveEvent;
    events: LiveEvent[];
    room_stats: LiveRoomStat[];
    event_stats: LiveEventStat[];
};

export default function StatisticsPage({ room, event, events, room_stats, event_stats }: PageProps) {
    const [polling, setPolling] = useState(false);
    const { stop, start } = usePoll(10000, {}, { autoStart: false });

    function togglePolling() {
        setPolling((prevState) => {
            if (prevState) stop();
            if (!prevState) start();
            return !prevState;
        });
    }

    if (!room) return <Welcome />;

    return (
        <AdminLayout breadcrumbTitle={event?.name}>
            <PageContainer
                title="观看数据"
                actions={[
                    <Toggle key="refresh" variant="outline" size="lg" onPressedChange={togglePolling} pressed={polling}>
                        <RefreshCw className={polling ? 'animate-spin' : ''} />
                        {polling ? '停止刷新' : '自动刷新'}
                    </Toggle>,
                    <RoomSelect route={route('broadcast.direction')} key="select" />,
                ]}
            >
                <Separator />
                {event ? <StatsEvent data={event_stats} /> : <StatsRoom data={room_stats} />}
                <Separator />
                <EventIndex data={events} />
            </PageContainer>
        </AdminLayout>
    );
}
