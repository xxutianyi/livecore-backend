import { User } from '@/services/model';
import { router } from '@inertiajs/react';
import { useEchoPresence } from '@laravel/echo-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function useReview(eventId: string) {
  const channelId = `live.message.${eventId}.review`;

  const [users, setUsers] = useState<User[]>([]);

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

  function handleMessageSubmitted() {
    toast.info('新评论待审核');
    router.reload({ only: ['messages'] });
  }

  function handleMessagePublished() {
    router.reload({ only: ['messages'] });
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

  return { users };
}
