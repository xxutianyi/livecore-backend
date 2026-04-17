import { PlaybackPlayer } from '@/components/player';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { LiveEvent } from '@/services/model';

export function Playback({ event }: { event: LiveEvent }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary">预览回放</Button>
            </DialogTrigger>
            <DialogContent className="block h-[36vw]! w-[60vw]! max-w-screen!">
                <DialogHeader className="mb-4">预览回放</DialogHeader>
                {event.playback_url ? <PlaybackPlayer src={event.playback_url} /> : '回放未生成'}
            </DialogContent>
        </Dialog>
    );
}
