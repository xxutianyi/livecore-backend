import axios from '@/lib/axios';
import { LiveEvent } from '@/services/model';
import { useEffect } from 'react';

export default function useOnline({ event, living }: { event?: LiveEvent; living?: boolean }) {
    useEffect(() => {
        if (event) {
            const data = { living, event_id: event.id, room_id: event.room_id };
            axios.post<string>('/api/presence/joined', data).then((res) => {
                localStorage.setItem('online_id', res.data);
            });

            const heartbeatInterval = setInterval(() => {
                const data = { living, event_id: event.id, room_id: event.room_id };
                axios.post('/api/presence/heartbeat', data);
            }, 10000);

            return () => {
                const online_id = localStorage.getItem('online_id');
                axios.post('/api/presence/leaving', { online_id });
                clearInterval(heartbeatInterval);
            };
        }
    }, []);
}
