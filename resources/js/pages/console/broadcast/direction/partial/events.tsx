import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Field, FieldGroup } from '@/components/ui/field';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { FormFieldText, FormFieldTextarea, FormFieldUpload } from '@/components/winglab/form';
import { Section } from '@/components/winglab/layout';
import { formatDatetime } from '@/lib/utils';
import { LiveEvent, LiveRoom } from '@/services/model';
import { Form, router } from '@inertiajs/react';
import { defineColumns, SimpleTable } from '@winglab/inertia-table';
import dayjs from 'dayjs';
import { TvMinimalPlay } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function EventCreate({ room }: { room: LiveRoom }) {
    const [open, setOpen] = useState(false);
    const defaultName = `${dayjs().format('YYYY年MM月DD日')}-第${room.events_count + 1}场`;

    return (
        <Section title="创建场次">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Empty className="border">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <TvMinimalPlay />
                            </EmptyMedia>
                            <EmptyTitle>未选择场次</EmptyTitle>
                            <EmptyDescription>点击创建新场次，或从历史场次中选择</EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>新建场次</DialogHeader>
                    <Form
                        action={route('broadcast.direction.store', room.id)}
                        method="POST"
                        onSuccess={() => {
                            setOpen(false);
                            toast.success('保存成功');
                        }}
                    >
                        <FieldGroup>
                            <FormFieldUpload name="cover" label="封面（留空将使用直播间封面）" accept="image/*" />
                            <FormFieldText name="name" label="名称" defaultValue={defaultName} />
                            <FormFieldTextarea name="desctiption" label="简介" defaultValue={room.description} />
                            <Field>
                                <Button type="submit">开始直播</Button>
                            </Field>
                        </FieldGroup>
                    </Form>
                </DialogContent>
            </Dialog>
        </Section>
    );
}

export function EventHistory({ events }: { events: LiveEvent[] }) {
    function handleSelect(data: LiveEvent) {
        router.get(route('broadcast.direction.show', [data.room_id, data.id]));
    }

    function handleDestroy(data: LiveEvent) {
        router.delete(route('broadcast.direction.destroy', [data.room_id, data.id]));
    }

    const columns = defineColumns<LiveEvent>([
        {
            title: '场次名称',
            dataKey: 'name',
        },
        {
            title: '场次简介',
            dataKey: 'description',
            tableRowRender: (data) => (
                <Tooltip>
                    <TooltipTrigger className="block max-w-32 overflow-hidden text-ellipsis">
                        {data.description}
                    </TooltipTrigger>
                    <TooltipContent className="break-all">{data.description}</TooltipContent>
                </Tooltip>
            ),
        },
        {
            title: '开始直播',
            dataKey: 'started_at',
            tableRowRender: (data) => formatDatetime(data.started_at),
        },
        {
            title: '结束直播',
            dataKey: 'finished_at',
            tableRowRender: (data) => formatDatetime(data.finished_at),
        },
        {
            index: 'actions',
            tableRowRender: (data) => {
                return (
                    <div className="flex w-32 items-center gap-x-2">
                        <Button variant="destructive" onClick={() => handleSelect(data)}>
                            {data.finished_at ? '重新开播' : '进入导播'}
                        </Button>
                        {!data.started_at && (
                            <Button variant="destructive" onClick={() => handleDestroy(data)}>
                                删除场次
                            </Button>
                        )}
                    </div>
                );
            },
        },
    ]);

    return (
        <Section title="历史场次">
            <SimpleTable columns={columns} data={events} />
        </Section>
    );
}
