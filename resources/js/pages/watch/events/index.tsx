import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { GridLayout } from '@/components/watch/layouts';
import { EventCardList } from '@/components/watch/rooms';
import { Breadcrumb } from '@/components/winglab/breadcrumb';
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
                <GridLayout>
                    <EventCardList events={events} />
                </GridLayout>
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
