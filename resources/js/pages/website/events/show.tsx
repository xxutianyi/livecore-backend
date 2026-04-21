import { Button } from '@/components/ui/button';
import { CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlayerCard, RightContent, WatchLayout } from '@/components/watch/layouts';
import { MessageList } from '@/components/watch/message';
import { PlaybackPlayer } from '@/components/watch/player';
import { EventItemList } from '@/components/watch/rooms';
import { Breadcrumb } from '@/components/winglab/breadcrumb';
import useOnline from '@/hooks/use-online';
import { WebsiteLayout } from '@/layouts/website-layout';
import { LiveEvent, LiveMessage, LiveRoom } from '@/services/model';
import { Link } from '@inertiajs/react';

type PageProps = { room: LiveRoom; event: LiveEvent; events: LiveEvent[]; messages: LiveMessage[] };

export default function Event({ room, event, events, messages }: PageProps) {
    useOnline({ event, living: false });

    return (
        <WebsiteLayout>
            <Breadcrumb
                className="mb-4 max-md:hidden md:mb-8"
                items={[
                    { label: '全部直播间', link: route('rooms.index') },
                    { label: room.name, link: route('rooms.show', room.id) },
                    { label: '直播回放', link: route('rooms.events.index', room.id) },
                    { label: event.name },
                ]}
            />
            <WatchLayout>
                <PlayerCard title={`${room.name}-${event.name}回放`}>
                    <PlaybackPlayer src={event.playback_url ?? ''} />
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
