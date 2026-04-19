import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Description, DescriptionItem } from '@/components/winglab/description';
import { PageContainer, SectionHeader } from '@/components/winglab/layout';
import { AdminLayout } from '@/layouts/admin-layout';
import { diffDatetime } from '@/lib/utils';
import { GroupIndex, GroupUpdate } from '@/pages/console/admin/live/rooms/partial/group';
import { LiveEvent, LiveRoom, UserGroup } from '@/services/model';
import { defineColumns } from '@winglab/inertia-table';
import { SimpleTable } from '@winglab/inertia-table/components/luma';
import { RoomUpdate } from './partial/forms';
import { Playback } from './partial/playback';

type PageProps = { room: LiveRoom; events: LiveEvent[]; groups: UserGroup[] };

export default function Show({ room, events, groups }: PageProps) {
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
        <AdminLayout breadcrumbTitle={room.name}>
            <PageContainer
                title="直播间信息"
                actions={[
                    <RoomUpdate room={room} key="update" />,
                    <GroupUpdate room={room} groups={groups} key="group" />,
                ]}
            >
                <Separator />
                <div>
                    <SectionHeader title="基本信息" />
                    <Description>
                        <DescriptionItem label="名称" className="col-span-1">
                            {room.name}
                        </DescriptionItem>
                        <DescriptionItem label="简介" className="col-span-3">
                            {room.description}
                        </DescriptionItem>
                    </Description>
                </div>
                <Separator />
                <div>
                    <SectionHeader title="场次信息" />
                    <SimpleTable columns={columns} data={events} />
                </div>
                <Separator />
                <div>
                    <SectionHeader title="授权用户组" />
                    <GroupIndex groups={groups} />
                </div>
            </PageContainer>
        </AdminLayout>
    );
}
