import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Description, DescriptionItem } from '@/components/winglab/description';
import { AdminLayout } from '@/layouts/admin-layout';
import { diffDatetime } from '@/lib/utils';
import { LiveEvent, LiveRoom } from '@/services/model';
import { defineColumns } from '@winglab/inertia-table';
import { SimpleTable } from '@winglab/inertia-table/components/luma';
import { RoomUpdate } from './partial/forms';
import { Playback } from './partial/playback';

type PageProps = { room: LiveRoom; events: LiveEvent[] };

export default function Show({ room, events }: PageProps) {
    const columns = defineColumns<LiveEvent>([
        {
            title: '场次名称',
            dataKey: 'name',
        },
        {
            title: '场次简介',
            dataKey: 'description',
        },
        {
            title: '开始直播',
            dataKey: 'started_at',
        },
        {
            title: '结束直播',
            dataKey: 'finished_at',
        },
        {
            title: '直播时长',
            index: 'duration',
            tableRowRender: (data) => diffDatetime(data.started_at, data.finished_at),
        },
        {
            index: 'actions',
            tableRowRender: (data) => {
                return (
                    <>
                        <Playback event={data} />
                        <Button asChild variant="secondary">
                            <a href={route('rooms.events.show', [data.room_id, data.id])} target="_blank">
                                查看回放和评论
                            </a>
                        </Button>
                    </>
                );
            },
        },
    ]);

    return (
        <AdminLayout breadcrumbTitle={room.name} className="p-4">
            <div className="w-full space-y-4">
                <div className="flex items-center justify-between font-heading text-base font-bold">
                    <span>直播间信息</span>
                    <RoomUpdate room={room} />
                </div>
                <Description>
                    <DescriptionItem label="名称" className="col-span-1">
                        {room.name}
                    </DescriptionItem>
                    <DescriptionItem label="简介" className="col-span-3">
                        {room.description}
                    </DescriptionItem>
                </Description>
                <Separator />
                <div className="font-heading text-base font-bold">场次信息</div>
                <SimpleTable columns={columns} data={events} />
            </div>
        </AdminLayout>
    );
}
