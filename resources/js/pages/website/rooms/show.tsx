import { Breadcrumb } from '@/components/breadcrumb';
import { VideoPlayer } from '@/components/player';
import { Card } from '@/components/ui/card';
import useOnline from '@/hooks/use-online';
import { WebsiteLayout } from '@/layouts/website-layout';
import { cn } from '@/lib/utils';
import { LiveMessages } from '@/pages/website/rooms/partial/message';
import { Waiting } from '@/pages/website/rooms/partial/waiting';
import { LiveMessage, LiveRoom } from '@/services/model';
import { Video } from 'lucide-react';

export default function Room({ room, messages }: { room: LiveRoom; messages?: LiveMessage[] }) {
  useOnline({ event: room.living, living: true });

  return (
    <WebsiteLayout>
      <Breadcrumb
        className={cn(!!room.living && 'mb-4 max-md:hidden md:mb-8')}
        items={[{ label: '全部直播间', link: route('watch.rooms.index') }, { label: room.name }]}
      />
      {!room.living && <Waiting room={room} />}
      {!!room.living && (
        <div className="max-md:-m-4 max-md:flex-col md:flex md:gap-x-4">
          <Card className="relative aspect-video p-0 max-md:rounded-none md:w-3/4">
            <div className="absolute top-4 left-5 z-10 flex items-center space-x-2 text-gray-50 max-md:hidden">
              <Video className="inline size-4" />
              <span className="font-heading text-base font-medium">{`${room.name}正在直播`}</span>
            </div>
            <VideoPlayer src={room.living.pull_url} live />
          </Card>
          <LiveMessages
            title={`${room.name}正在直播`}
            event={room.living}
            initMessages={messages ?? []}
          />
        </div>
      )}
    </WebsiteLayout>
  );
}
