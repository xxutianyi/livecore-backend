import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { PageContainer } from '@/components/winglab/layout';
import { AdminLayout } from '@/layouts/admin-layout';
import { diffDatetime, formatDatetime } from '@/lib/utils';
import { LiveEvent, LiveRoom } from '@/services/model';
import { router } from '@inertiajs/react';
import { DataTable, defineColumns, PaginateData } from '@winglab/inertia-table';
import { MoreHorizontal } from 'lucide-react';
import { UploadPlayback, ViewPlayback } from './partial/playback';
import { RoomSelect } from './partial/room-select';
import Welcome from './welcome';

export default function PlaybacksPage({ room, events }: { room?: LiveRoom; events: PaginateData<LiveEvent> }) {
    if (!room) return <Welcome />;

    function handlePublish(event: LiveEvent) {
        router.put(route('broadcast.playbacks.update', [room?.id, event.id]), { published: !event.published });
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
            title: '直播时长',
            index: 'duration',
            tableRowRender: (data) => diffDatetime(data.started_at, data.finished_at),
        },
        {
            index: 'actions',
            tableRowRender: (data) => {
                return (
                    <div className="flex items-center gap-x-2">
                        <ViewPlayback event={data} />
                        <UploadPlayback event={data} />
                        <Button
                            variant={data.published ? 'destructive' : 'outline'}
                            onClick={() => handlePublish(data)}
                        >
                            {data.published ? '撤回回放' : '发布回放'}
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <MoreHorizontal />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <a href={route('rooms.events.show', [data.room_id, data.id])} target="_blank">
                                        观众视角
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <a href={data.playback_url} download={`${data.name}.mp4`} target="_blank">
                                        下载视频
                                    </a>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ]);

    return (
        <AdminLayout>
            <PageContainer
                title="直播回放"
                actions={[<RoomSelect route={route('broadcast.playbacks')} key="select" />]}
            >
                <DataTable columns={columns} paginateData={events} />
            </PageContainer>
        </AdminLayout>
    );
}
