import axios from '@/lib/axios';
import { LiveEvent, LiveRoom } from '@/services/model';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

type PageProps = { room?: LiveRoom; event?: LiveEvent };

export default function useOnline() {
    const url = usePage().url;
    const { room, event } = usePage<PageProps>().props;

    const meta = () => {
        const online_id = localStorage.getItem('online_id');
        return { online_id, meta: { url, room, event } };
    };

    useEffect(() => {
        axios.post<string>('/api/presence/joined').then((res) => {
            localStorage.setItem('online_id', res.data);
            axios.post('/api/presence/heartbeat', meta());
        });

        const heartbeatInterval = setInterval(() => {
            axios.post('/api/presence/heartbeat', meta());
        }, 10000);

        return () => {
            axios.post('/api/presence/heartbeat', meta());
            axios.post('/api/presence/leaving', meta());
            clearInterval(heartbeatInterval);
        };
    }, []);
}
