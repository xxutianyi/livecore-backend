import { PlayerCard, WatchLayout } from '@/components/watch/layouts';
import { LiveMessageList } from '@/components/watch/message';
import { PlaybackPlayer } from '@/components/watch/player';
import { Breadcrumb } from '@/components/winglab/breadcrumb';
import { useMessage } from '@/hooks/use-message';
import { WebsiteLayout } from '@/layouts/website-layout';
import { cn } from '@/lib/utils';
import { Waiting, WaitingProps } from '@/pages/watch/rooms/partial/waiting';
import { LiveEvent, LiveMessage } from '@/services/model';

export type RoomPageProps = WaitingProps & { event?: LiveEvent; messages?: LiveMessage[] };

export default function Room({ room, event, messages = [] }: RoomPageProps) {
    const breadcrumbItem = [
        {
            label: '全部直播间',
            link: route('rooms.index'),
        },
        {
            label: room.name,
        },
    ];

    const { users, messages: liveMessages, handleMessageUpdate } = useMessage(event?.id, messages);

    return (
        <WebsiteLayout title={`观看直播：${room.name}`}>
            <Breadcrumb className={cn(!!event && 'mb-4 max-md:hidden md:mb-8')} items={breadcrumbItem} />
            {!event && <Waiting room={room} />}
            {!!event && (
                <WatchLayout>
                    <PlayerCard title={`${room.name}正在直播`}>
                        <PlaybackPlayer src={event.pull_url ?? event.playback_url ?? ''} />
                    </PlayerCard>
                    <LiveMessageList
                        title={`${room.name}正在直播`}
                        users={users}
                        event={event}
                        messages={liveMessages}
                        handleMessageUpdate={handleMessageUpdate}
                    />
                </WatchLayout>
            )}
        </WebsiteLayout>
    );
}
