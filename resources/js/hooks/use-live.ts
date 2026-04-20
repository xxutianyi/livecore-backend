import { LiveMessage, User } from '@/services/model';
import { router } from '@inertiajs/react';
import { useEchoPresence } from '@laravel/echo-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function useLive(eventId?: string, initMessages: LiveMessage[] = []) {
    const channelId = `live.message.${eventId}`;

    const [users, setUsers] = useState<User[]>([]);
    const [messages, setMessages] = useState<LiveMessage[]>(initMessages);

    const { channel, leave } = useEchoPresence(channelId);

    function handleHere(users: User[]) {
        setUsers(users);
    }

    function handleUserJoining(user: User) {
        setUsers((prev) => [...prev, user]);
    }

    function handleUserLeaving(user: User) {
        setUsers((prev) => prev.filter((a) => a.id !== user.id));
    }

    function handleChannelError(error: any) {
        console.error(`Channel Error: ${channelId}`, error);
        toast.error('互动功能连接失败');
    }

    function handleMessageUpdate({ message }: { message: LiveMessage }) {
        setMessages((prev) => {
            const hadOne = prev.find((item) => item.id === message.id);
            return hadOne ? prev : [...prev, message];
        });
    }

    function handleStreamingStop() {
        toast.info('直播已结束，即将为您刷新页面');
        router.reload();
    }

    function setChannelListener() {
        channel()
            .here(handleHere)
            .joining(handleUserJoining)
            .leaving(handleUserLeaving)
            .error(handleChannelError)
            .listen('LiveStreamingStop', handleStreamingStop)
            .listen('LiveMessagePublished', handleMessageUpdate);
    }

    useEffect(() => {
        if (eventId) {
            setChannelListener();

            return () => leave();
        }
    }, []);

    return { users, messages, handleMessageUpdate };
}
