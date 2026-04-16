'use client';

import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useScrollToBottom } from '@/hooks/use-scroll-to-bottom';
import { cn } from '@/lib/utils';
import { comments } from '@/services/fake';
import { LiveEvent } from '@/services/model';
import { ArrowDown, Send, Users } from 'lucide-react';
import { useEffect } from 'react';

export function CommentUser() {
    return (
        <div className="flex items-center space-x-2">
            <Users className="inline size-4" />
            <span>在线人数: 123112313223</span>
        </div>
    );
}

export function CommentItem({ name, content }: { name: string; content: string }) {
    return (
        <div className="py-2">
            <span className="whitespace-nowrap text-cyan-700 dark:text-cyan-500">
                {name}:&nbsp;
            </span>
            <span className="w-full break-all">{content}</span>
        </div>
    );
}

export function CommentList({
    className,
    eventId,
}: {
    className?: string;
    eventId?: LiveEvent['id'];
}) {
    const { bottomRef, viewportRef, isAtBottom, scrollToBottom } = useScrollToBottom();

    const commentsData = comments;

    useEffect(() => {
        scrollToBottom();
    }, []);

    return (
        <ScrollArea className={cn(className)} viewportRef={viewportRef}>
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
            {commentsData.map((value, index) => (
                <CommentItem name={value.sender_name} content={value.content} key={index} />
            ))}
            <div ref={bottomRef} />
        </ScrollArea>
    );
}

export function CommentSender() {
    return (
        <Field orientation="horizontal">
            <Input type="text" placeholder="参与互动..." aria-label="参与互动..." />
            <Button>
                <Send />
                发送
            </Button>
        </Field>
    );
}
