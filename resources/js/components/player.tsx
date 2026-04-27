'use client';

import Chinese from '@/assets/player-chinese.json';
import '@vidstack/react/player/styles/base.css';
import '@vidstack/react/player/styles/plyr/theme.css';

import { MediaPlayer, MediaPlayerInstance, MediaPlayerProps, MediaProvider, useMediaStore } from '@vidstack/react';
import { PlyrLayout, plyrLayoutIcons } from '@vidstack/react/player/layouts/plyr';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

type PlayerProps = { src?: string; live?: boolean; className?: string };

export function VideoPlayer({ src, live, className }: PlayerProps) {
    const ref = useRef<MediaPlayerInstance>(null);
    const { ended, error, streamType } = useMediaStore(ref);

    const mediaPlayerConfig: Partial<MediaPlayerProps> = {
        src: src,
        ref: ref,
        autoPlay: true,
        playsInline: true,
        streamType: live ? 'live' : undefined,
    };

    useEffect(() => {
        if (error && streamType !== 'live') {
            toast.info('播放错误，请稍后重试');
        }
        if ((error || ended) && streamType === 'live') {
            toast.info('直播未开始或已结束');
        }
    }, [ended, error, streamType]);

    return (
        <div className={className}>
            <MediaPlayer {...mediaPlayerConfig}>
                <MediaProvider />
                <PlyrLayout icons={plyrLayoutIcons} translations={Chinese} />
            </MediaPlayer>
        </div>
    );
}
