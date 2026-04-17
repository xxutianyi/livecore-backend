import { PlaybackPlayer } from '@/components/player';
import { EventItemList } from '@/components/rooms';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlayerCard, RightContent, WatchLayout } from '@/components/watch/layouts';
import { MessageList } from '@/components/watch/message';
import { Breadcrumb } from '@/components/winglab/breadcrumb';
import { WebsiteLayout } from '@/layouts/website-layout';
import { LiveEvent, LiveMessage, LiveRoom } from '@/services/model';
import { Link } from '@inertiajs/react';

type PageProps = { room: LiveRoom; event: LiveEvent; events: LiveEvent[]; messages: LiveMessage[] };

export default function Event({ room, event, events, messages }: PageProps) {
    const breadcrumbItem = [
        {
            label: '全部直播间',
            link: `/rooms`,
        },
        {
            label: room.name,
            link: `/rooms/${room.id}`,
        },
        {
            label: '直播回放',
            link: `/rooms/${room.id}/events`,
        },
        {
            label: event.name,
        },
    ];

    return (
        <WebsiteLayout>
            <Breadcrumb className="mb-4 max-md:hidden md:mb-8" items={breadcrumbItem} />
            <WatchLayout>
                <PlayerCard title={`${room.name}-${event.name}回放`}>
                    <PlaybackPlayer src={event.playback_url!} />
                </PlayerCard>
                <RightContent>
                    <Tabs defaultValue="events">
                        <CardHeader className="-mt-3">
                            <TabsList className="w-full">
                                <TabsTrigger value="events">回放列表</TabsTrigger>
                                <TabsTrigger value="comments">互动评论</TabsTrigger>
                            </TabsList>
                        </CardHeader>
                        <TabsContent value="events">
                            <CardContent className="absolute top-16 bottom-7 w-full border-y bg-muted/50 md:bottom-0">
                                <ScrollArea className="-mr-4 h-full py-2 pr-4">
                                    <EventItemList events={events} />
                                </ScrollArea>
                            </CardContent>
                        </TabsContent>
                        <TabsContent value="comments">
                            <CardContent className="absolute top-16 bottom-7 w-full border-y bg-muted/50 md:bottom-0">
                                <ScrollArea className="-mr-4 h-full py-2 pr-4">
                                    <MessageList messages={messages} />
                                </ScrollArea>
                            </CardContent>
                        </TabsContent>
                    </Tabs>
                    <Button className="absolute bottom-0 w-full rounded-none md:hidden" asChild>
                        <Link href={`/rooms/${room.id}`}>返回直播间</Link>
                    </Button>
                </RightContent>
            </WatchLayout>
        </WebsiteLayout>
    );
}
