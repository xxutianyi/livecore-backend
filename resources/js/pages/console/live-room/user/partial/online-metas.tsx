import { defineColumns, SimpleTable } from '@/components/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { formatDatetime } from '@/lib/utils';
import { UserHeartbeat } from '@/services/model';

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
