import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Section } from '@/components/winglab/layout';
import { diffDatetime, formatDatetime } from '@/lib/utils';
import { UserHeartbeat, UserOnline } from '@/services/model';
import { defineColumns, SimpleTable } from '@winglab/inertia-table';

export function Online({ onlines }: { onlines: UserOnline[] }) {
    const onlineColumns = defineColumns<UserOnline>([
        {
            title: '上线时间',
            dataKey: 'joined_at',
            tableRowRender: (data) => formatDatetime(data.joined_at),
        },
        {
            title: '下线时间',
            dataKey: 'leaving_at',
            tableRowRender: (data) => formatDatetime(data.leaving_at),
        },
        {
            title: '在线时长',
            tableRowRender: (data) => diffDatetime(data.joined_at, data.leaving_at),
        },
        {
            title: '轨迹数量',
            dataKey: 'heartbeats_count',
        },
        {
            index: 'actions',
            tableRowRender: (data) => <OnlineMetas metas={data.heartbeats} />,
        },
    ]);

    return (
        <Section title="访问记录">
            <SimpleTable data={onlines} columns={onlineColumns} />
        </Section>
    );
}

export function OnlineMetas({ metas }: { metas?: UserHeartbeat[] }) {
    const columns = defineColumns([
        {
            title: '时间戳',
            dataKey: 'created_at',
            tableRowRender: (data) => formatDatetime(data.created_at),
        },
        {
            title: '访问页面',
            dataKey: 'meta',
            tableRowRender: (data) => (
                <div className="flex items-center gap-x-2">
                    {data.meta.url === '/rooms' && '直播间列表'}
                    {data.meta.room && `直播间：${data.meta.room.name}`}
                    {data.meta.event && <Separator orientation="vertical" />}
                    {data.meta.event && `直播场次：${data.meta.event.name}`}
                </div>
            ),
        },
    ]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary">访问轨迹</Button>
            </DialogTrigger>
            <DialogContent className="block h-[60vh]! w-[60vw]! max-w-screen!">
                <DialogHeader className="mb-4">访问轨迹</DialogHeader>
                <SimpleTable data={metas} columns={columns} />
            </DialogContent>
        </Dialog>
    );
}
