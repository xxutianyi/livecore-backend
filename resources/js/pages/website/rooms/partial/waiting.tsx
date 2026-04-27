import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { LiveRoom } from '@/services/model';
import { router } from '@inertiajs/react';
import { RefreshCcw, Video } from 'lucide-react';

export type WaitingProps = { room: LiveRoom };

export function Waiting({ room }: WaitingProps) {
  return (
    <Empty className="m-auto w-full">
      <EmptyMedia>
        <img alt="cover" src={room.cover} className="aspect-video max-w-sm rounded-4xl" />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>{room.name}暂未开播</EmptyTitle>
        <EmptyDescription className="max-w-xs text-pretty">可查看直播回放</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="mb-32">
        <div className="space-x-4">
          <Button onClick={() => router.get(route('rooms.events.index', room.id))}>
            查看回放
            <Video />
          </Button>
          <Button onClick={() => router.reload()}>
            刷新状态
            <RefreshCcw />
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}
