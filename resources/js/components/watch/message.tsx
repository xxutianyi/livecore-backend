import { Button } from '@/components/ui/button';
import { CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RightContent } from '@/components/watch/layouts';
import { useMessage } from '@/hooks/use-message';
import { useScrollToBottom } from '@/hooks/use-scroll-to-bottom';
import { LiveEvent, LiveMessage } from '@/services/model';
import { router } from '@inertiajs/react';
import { ArrowDown, Send, Users, Video } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export type MessageListProps = ReturnType<typeof useMessage> & {
    title: string;
    event: LiveEvent;
    className?: string;
};

export type MessageSenderProps = Pick<MessageListProps, 'event' | 'handleMessageUpdate'>;

export function MessageItem({ message }: { message: LiveMessage }) {
    return (
        <div className="py-2">
            <span className="whitespace-nowrap text-cyan-700 dark:text-cyan-500">{message.sender?.name}：&nbsp;</span>
            <span className="w-full break-all">{message.content}</span>
        </div>
    );
}

export function MessageList({ messages }: { messages: LiveMessage[] }) {
    return messages.map((message) => <MessageItem message={message} key={message.id} />);
}

export function MessageSender({ event, handleMessageUpdate }: MessageSenderProps) {
    const [message, setMessage] = useState('');

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
        <Field orientation="horizontal">
            <Input type="text" placeholder="参与互动..." value={message} onChange={(e) => setMessage(e.target.value)} />
            <Button onClick={handlePublish}>
                <Send />
                发送
            </Button>
        </Field>
    );
}

export function LiveMessageList({ title, users, event, messages, handleMessageUpdate, className }: MessageListProps) {
    const { bottomRef, viewportRef, isAtBottom, scrollToBottom } = useScrollToBottom();

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <RightContent className={className}>
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
                <MessageSender event={event} handleMessageUpdate={handleMessageUpdate} />
            </CardFooter>
        </RightContent>
    );
}
