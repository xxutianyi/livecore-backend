import { LiveMessage, User } from '@/services/model';
import { useEchoPresence } from '@laravel/echo-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function useReview(eventId: string, initMessages: LiveMessage[] = []) {
    const channelId = `live.message.${eventId}.review`;

    const [users, setUsers] = useState<User[]>([]);
    const [messages, setMessages] = useState<LiveMessage[]>(initMessages);

    const { channel, leave } = useEchoPresence(channelId);

    function handleHere(users: User[]) {
        setUsers(users);
        toast.success('审核功能连接成功');
    }

    function handleUserJoining(user: User) {
        setUsers((prev) => [...prev, user]);
    }

    function handleUserLeaving(user: User) {
        setUsers((prev) => prev.filter((a) => a.id !== user.id));
    }

    function handleChannelError(error: any) {
        console.error(`Channel Error: ${channelId}`, error);
        toast.error('审核功能连接失败');
    }

    function handleMessageSubmitted({ message }: { message: LiveMessage }) {
        toast.info('新评论待审核');
        setMessages((prev) => {
            return [message, ...prev];
        });
    }

    function handleMessagePublished({ message }: { message: LiveMessage }) {
        setMessages((prev) => {
            return [message, ...prev.filter((m) => m.id !== message.id)];
        });
    }

    useEffect(() => {
        channel()
            .here(handleHere)
            .joining(handleUserJoining)
            .leaving(handleUserLeaving)
            .error(handleChannelError)
            .listen('LiveMessageSubmitted', handleMessageSubmitted)
            .listen('LiveMessagePublished', handleMessagePublished);

        return () => leave();
    }, []);

    return { users, messages };
}
