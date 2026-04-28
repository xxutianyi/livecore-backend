import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { LiveEvent, LiveMessage, LiveRoom } from '@/services/model';
import { Link } from '@inertiajs/react';
import { Play } from 'lucide-react';

export function RoomBadge({ room }: { room: LiveRoom }) {
  if (room.living) {
    return <Badge variant="default">正在直播</Badge>;
  }
  return <Badge variant="secondary">可看回放</Badge>;
}

export function RoomItemCard({ room }: { room: LiveRoom }) {
  return (
    <Card className="relative mx-auto w-full pt-0">
      <img alt="cover" src={room.cover} className="aspect-video bg-gray-500" />
      <CardHeader>
        <CardAction>
          <RoomBadge room={room} />
        </CardAction>
        <CardTitle>{room.name}</CardTitle>
        <CardDescription>{room.description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href={route('watch.rooms.show', room.id)}>进入直播间</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function EventItem({ event, current }: { event: LiveEvent; current: LiveEvent }) {
  const isCurrentPlay = event.id === current.id;

  return (
    <Link
      className="py-2"
      preserveScroll
      href={route('watch.rooms.events.show', [event.room_id, event.id])}
    >
      <div className={cn('flex h-20 space-x-4 rounded-lg p-2', isCurrentPlay && 'bg-muted')}>
        <div className="relative aspect-video max-h-16 rounded bg-gray-500">
          <img alt="cover" src={event.cover} className="h-full w-full" />
          {isCurrentPlay && (
            <Badge className="absolute top-1/2 right-1/2 bottom-1/2 left-1/2 -translate-1/2">
              <Play />
              正在播放
            </Badge>
          )}
        </div>
        <div className="flex max-h-16 flex-col justify-between">
          <p className="flex items-center font-heading text-sm font-bold">{event.name}</p>
          <p className="overflow-hidden text-sm text-ellipsis">{event.description}</p>
        </div>
      </div>
      <Separator />
    </Link>
  );
}

export function EventItemCard({ event }: { event: LiveEvent }) {
  const { id, room_id, name, description } = event;

  return (
    <Card className="relative mx-auto w-full pt-0">
      <img alt="cover" src={event.cover} className="aspect-video bg-gray-500" />
      <CardHeader>
        <CardTitle>回放：{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href={route('watch.rooms.events.show', [room_id, id])}>观看回放</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function MessageItem({ message }: { message: LiveMessage }) {
  return (
    <div className="py-2">
      <span className="whitespace-nowrap text-cyan-700 dark:text-cyan-500">
        {message?.sender?.name}：&nbsp;
      </span>
      <span className="w-full break-all">{message?.content}</span>
    </div>
  );
}

export function RoomCardList({ rooms }: { rooms: LiveRoom[] }) {
  return rooms.map((room) => <RoomItemCard key={room.id} room={room} />);
}

export function EventCardList({ events }: { events: LiveEvent[] }) {
  return events.map((event) => <EventItemCard key={event.id} event={event} />);
}

export function EventItemList({ current, events }: { current: LiveEvent; events: LiveEvent[] }) {
  return events.map((event) => <EventItem key={event.id} event={event} current={current} />);
}

export function MessageList({ messages }: { messages: LiveMessage[] }) {
  return messages.map((message, index) => <MessageItem message={message} key={index} />);
}
