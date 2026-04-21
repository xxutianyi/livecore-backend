import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { LiveEvent, LiveRoom } from '@/services/model';
import { Link, usePage } from '@inertiajs/react';
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
                    <Link href={route('rooms.show', room.id)}>进入直播间</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export function EventItem({ event }: { event: LiveEvent }) {
    const { event: currentPlay } = usePage<{ event: LiveEvent }>().props;
    const isCurrentPlay = currentPlay.id === event.id;

    return (
        <Link className="py-2" href={`/rooms/${event.room_id}/events/${event.id}`} preserveScroll>
            <div className={cn('flex h-20 space-x-4 rounded-lg p-2', isCurrentPlay && 'bg-muted')}>
                <img alt="cover" src={event.cover} className="aspect-video max-h-16 rounded bg-gray-500" />
                <div className="flex max-h-16 flex-col justify-between">
                    <p className="flex items-center font-heading text-sm font-bold">
                        {event.name}
                        {isCurrentPlay && (
                            <Badge className="scale-75">
                                <Play />
                                正在播放
                            </Badge>
                        )}
                    </p>
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
                    <Link href={route('rooms.events.show', [room_id, id])}>观看回放</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export function RoomCardList({ rooms }: { rooms: LiveRoom[] }) {
    return rooms.map((room) => <RoomItemCard key={room.id} room={room} />);
}

export function EventCardList({ events }: { events: LiveEvent[] }) {
    return events.map((event) => <EventItemCard key={event.id} event={event} />);
}

export function EventItemList({ events }: { events: LiveEvent[] }) {
    return events.map((event) => <EventItem key={event.id} event={event} />);
}
