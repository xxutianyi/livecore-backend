import { PageContainer } from '@/components/container';
import { Button } from '@/components/ui/button';
import { AdminLayout } from '@/layouts/admin-layout';
import { LiveRoom } from '@/services/model';
import { Link } from '@inertiajs/react';
import { ColumnsDef, PaginateData, RouterTable } from '@winglab/inertia-table';
import { RoomCreate } from './partial/forms';

export default function Room({ data }: { data: PaginateData<LiveRoom> }) {
    const columns = ColumnsDef<LiveRoom>([
        {
            dataKey: 'name',
            title: '名称',
            sortable: true,
        },
        {
            dataKey: 'description',
            title: '简介',
            sortable: true,
        },
        {
            index: 'actions',
            tableRowRender: (data) => {
                return (
                    <Button asChild variant="secondary">
                        <Link href={route('settings.rooms.show', data.id)}>详情</Link>
                    </Button>
                );
            },
        },
    ]);

    return (
        <AdminLayout>
            <PageContainer title="直播间列表" actions={[<RoomCreate key="create" />]}>
                <RouterTable columns={columns} data={data} />
            </PageContainer>
        </AdminLayout>
    );
}
