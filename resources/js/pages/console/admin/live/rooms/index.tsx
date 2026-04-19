import { Button } from '@/components/ui/button';
import { AdminLayout } from '@/layouts/admin-layout';
import { LiveRoom } from '@/services/model';
import { Link } from '@inertiajs/react';
import { DataTable, defineColumns, type PaginateData } from '@winglab/inertia-table';
import { RoomCreate } from './partial/forms';

export default function Room({ data }: { data: PaginateData<LiveRoom> }) {
    const columns = defineColumns<LiveRoom>([
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
                        <Link href={route('admin.live.rooms.show', data.id)}>详情</Link>
                    </Button>
                );
            },
        },
    ]);

    return (
        <AdminLayout className="p-4">
            <div className="w-full space-y-4">
                <div className="font-heading text-base font-bold">
                    <span>直播间列表</span>
                </div>
                <DataTable columns={columns} paginateData={data} toolbarAction={<RoomCreate />} />
            </div>
        </AdminLayout>
    );
}
