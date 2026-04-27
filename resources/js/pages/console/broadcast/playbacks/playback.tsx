import { UploadField } from '@/components/form';
import { VideoPlayer } from '@/components/player';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Field, FieldGroup } from '@/components/ui/field';
import { LiveEvent } from '@/services/model';
import { Form } from '@inertiajs/react';
import { XIcon } from 'lucide-react';
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
                {event.playback_url ? (
                    <VideoPlayer src={event.playback_url} />
                ) : (
                    <div className="flex h-full p-8">
                        <Empty className="border">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <XIcon />
                                </EmptyMedia>
                                <EmptyTitle>回放读取失败或未生成</EmptyTitle>
                            </EmptyHeader>
                        </Empty>
                    </div>
                )}
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
                        <UploadField name="file" accept={['video/mp4']} />
                        <Field>
                            <Button type="submit">保存</Button>
                        </Field>
                    </FieldGroup>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
