import { PlayerCard, WatchLayout } from '@/components/watch/layouts';
import { LiveMessageList } from '@/components/watch/message';
import { PlaybackPlayer } from '@/components/watch/player';
import { Breadcrumb } from '@/components/winglab/breadcrumb';
import { useLive } from '@/hooks/use-live';
import useOnline from '@/hooks/use-online';
import { WebsiteLayout } from '@/layouts/website-layout';
import { cn } from '@/lib/utils';
import { Waiting } from '@/pages/website/rooms/partial/waiting';
import { LiveMessage, LiveRoom } from '@/services/model';

export default function Room({ room, messages }: { room: LiveRoom; messages?: LiveMessage[] }) {
    useOnline({ event: room.living, living: true });
    const { users, messages: liveMessages, handleMessageUpdate } = useLive(room.living?.id, messages);

    return (
        <WebsiteLayout title={`观看直播：${room.name}`}>
            <Breadcrumb
                className={cn(!!room.living && 'mb-4 max-md:hidden md:mb-8')}
                items={[{ label: '全部直播间', link: route('rooms.index') }, { label: room.name }]}
            />
            {!room.living && <Waiting room={room} />}
            {!!room.living && (
                <WatchLayout>
                    <PlayerCard title={`${room.name}正在直播`}>
                        <PlaybackPlayer src={room.living.pull_url} />
                    </PlayerCard>
                    <LiveMessageList
                        title={`${room.name}正在直播`}
                        users={users}
                        event={room.living}
                        messages={liveMessages}
                        handleMessageUpdate={handleMessageUpdate}
                    />
                </WatchLayout>
            )}
        </WebsiteLayout>
    );
}
