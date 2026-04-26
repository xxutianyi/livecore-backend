import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldGroup } from '@/components/ui/field';
import { PlaybackPlayer } from '@/components/watch/player';
import { UploadField } from '@/components/winglab/form';
import { LiveEvent } from '@/services/model';
import { Form } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

export function ViewPlayback({ event }: { event: LiveEvent }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">预览回放</Button>
            </DialogTrigger>
            <DialogContent className="block h-[36vw]! w-[60vw]! max-w-screen!">
                <DialogHeader className="mb-4">
                    <DialogTitle>预览回放</DialogTitle>
                </DialogHeader>
                {event.playback_url ? <PlaybackPlayer src={event.playback_url} /> : '回放未生成'}
            </DialogContent>
        </Dialog>
    );
}

export function UploadPlayback({ event }: { event: LiveEvent }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">覆盖视频</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>覆盖回放视频</DialogTitle>
                    <DialogDescription className="text-destructive">保存后无法恢复，请谨慎操作</DialogDescription>
                </DialogHeader>
                <Form
                    action={route('broadcast.playbacks.upload', [event.room_id, event.id])}
                    method="POST"
                    onSuccess={() => {
                        setOpen(false);
                        toast.success('保存成功');
                    }}
                >
                    <FieldGroup>
                        <UploadField name="file" accept="video/mp4" />
                        <Field>
                            <Button type="submit">保存</Button>
                        </Field>
                    </FieldGroup>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
