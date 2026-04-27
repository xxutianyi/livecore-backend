import { VideoPlayer } from '@/components/player';
import FloatingWindow from '@/components/window';
import { LiveEvent } from '@/services/model';

export function Preview({ event }: { event: LiveEvent }) {
  return (
    <FloatingWindow title="直播监看">
      <VideoPlayer src={event.pull_url} live />
    </FloatingWindow>
  );
}
