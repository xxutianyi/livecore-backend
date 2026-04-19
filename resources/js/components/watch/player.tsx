import Chinese from '@/assets/player-chinese.json';
import '@vidstack/react/player/styles/base.css';
import '@vidstack/react/player/styles/plyr/theme.css';

import { MediaPlayer, MediaPlayerInstance, MediaPlayerProps, MediaProvider, useMediaStore } from '@vidstack/react';
import { PlyrLayout, plyrLayoutIcons } from '@vidstack/react/player/layouts/plyr';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

function Player({ className, ...props }: Omit<MediaPlayerProps, 'children'>) {
    return (
        <div className={className}>
            <MediaPlayer {...props} autoPlay playsInline>
                <MediaProvider />
                <PlyrLayout icons={plyrLayoutIcons} translations={Chinese} />
            </MediaPlayer>
        </div>
    );
}

export function LivePlayer({ className, src }: { className?: string; src: string }) {
    const player = useRef<MediaPlayerInstance>(null);
    const { waiting, ended, error, streamType } = useMediaStore(player);

    useEffect(() => {
        if (ended && streamType === 'live') {
            toast.info('直播未开始或已结束', { position: 'top-right' });
        }
    }, [ended, streamType]);

    useEffect(() => {
        let timer: number | undefined;

        if (waiting && streamType === 'live') {
            timer = setTimeout(() => {
                if (waiting) {
                    toast.info('直播未开始或已结束', { position: 'top-right' });
                }
            }, 5000);
        }

        return () => clearTimeout(timer);
    }, [waiting, streamType]);

    useEffect(() => {
        if (error) {
            toast.info('直播未开始或已结束', { position: 'top-right' });
        }
    }, [error]);

    return <Player src={src} ref={player} className={className} streamType="live" />;
}

export function PlaybackPlayer({ className, src }: { className?: string; src: string }) {
    const player = useRef<MediaPlayerInstance>(null);
    const { error } = useMediaStore(player);

    useEffect(() => {
        if (error) {
            toast.info('播放错误，请稍后重试', { position: 'top-right' });
        }
    }, [error]);

    return <Player src={src} ref={player} className={className} />;
}
