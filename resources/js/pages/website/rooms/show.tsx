import { PlayerCard, WatchLayout } from '@/components/watch/layouts';
import { LiveMessageList } from '@/components/watch/message';
import { PlaybackPlayer } from '@/components/watch/player';
import { Breadcrumb } from '@/components/winglab/breadcrumb';
import { useLive } from '@/hooks/use-live';
import useOnline from '@/hooks/use-online';
import { WebsiteLayout } from '@/layouts/website-layout';
import { cn } from '@/lib/utils';
import { Waiting, WaitingProps } from '@/pages/website/rooms/partial/waiting';
import { LiveEvent, LiveMessage } from '@/services/model';

export type RoomPageProps = WaitingProps & { event?: LiveEvent; messages?: LiveMessage[] };

export default function Room({ room, event, messages = [] }: RoomPageProps) {
    useOnline({ event, living: true });
    const { users, messages: liveMessages, handleMessageUpdate } = useLive(event?.id, messages);

    return (
        <WebsiteLayout title={`观看直播：${room.name}`}>
            <Breadcrumb
                className={cn(!!event && 'mb-4 max-md:hidden md:mb-8')}
                items={[{ label: '全部直播间', link: route('rooms.index') }, { label: room.name }]}
            />
            {!event && <Waiting room={room} />}
            {!!event && (
                <WatchLayout>
                    <PlayerCard title={`${room.name}正在直播`}>
                        <PlaybackPlayer src={event.pull_url} />
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
