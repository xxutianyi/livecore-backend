import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageList } from '@/components/watch';
import { useLive } from '@/hooks/use-live';
import { useScroll } from '@/hooks/use-scroll';
import { LiveEvent, LiveMessage } from '@/services/model';
import { router } from '@inertiajs/react';
import { ArrowDown, Send, Users, Video } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function LiveMessages({
  title,
  event,
  initMessages,
}: {
  title: string;
  event: LiveEvent;
  initMessages: LiveMessage[];
}) {
  const [message, setMessage] = useState('');
  const { users, messages, handleMessageUpdate } = useLive(event?.id, initMessages);
  const { isAtBottom, bottomRef, viewportRef, scrollToBottom } = useScroll([messages]);

  function handlePublish() {
    router.post(
      `/events/${event.id}/message`,
      { content: message },
      {
        onSuccess: () => {
          setMessage('');
          toast.success('发送成功');
        },
        onFlash: (data) => {
          handleMessageUpdate(data as { message: LiveMessage });
        },
      },
    );
  }

  return (
    <Card className="relative max-md:h-[calc(100svh-64px-56.25vw)] max-md:rounded-none md:w-1/4">
      <CardHeader className="-mt-1">
        <CardTitle className="flex items-center justify-between max-md:text-sm">
          <div className="flex items-center space-x-2 md:hidden">
            <Video className="inline size-4" />
            <span>{title}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="inline size-4" />
            <span>在线人数: {users.length}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="absolute top-16 bottom-20 w-full border-y bg-muted/50">
        <ScrollArea className="-mr-4 h-full py-2 pr-4" viewportRef={viewportRef}>
          {!isAtBottom && (
            <Button
              variant="outline"
              onClick={scrollToBottom}
              className="absolute right-2 opacity-50 hover:opacity-100"
            >
              <ArrowDown />
              最新评论
            </Button>
          )}
          <MessageList messages={messages} />
          <div ref={bottomRef} />
        </ScrollArea>
      </CardContent>
      <CardFooter className="absolute bottom-0 h-20 w-full">
        <Field orientation="horizontal">
          <Input
            aria-label="参与互动..."
            placeholder="参与互动..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button onClick={handlePublish}>
            <Send />
            发送
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
