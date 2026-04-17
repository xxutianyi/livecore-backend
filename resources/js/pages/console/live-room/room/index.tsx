import { Button } from '@/components/ui/button';
import { DataTable, defineColumns } from '@/components/winglab/table';
import { ConsoleLayout } from '@/layouts/console-layout';
import { LiveRoom } from '@/services/model';
import { PaginateData } from '@/types';
import { Link } from '@inertiajs/react';
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
                        <Link href={route('console.rooms.show', data.id)}>详情</Link>
                    </Button>
                );
            },
        },
    ]);

    return (
        <ConsoleLayout className="p-4">
            <div className="w-full space-y-4">
                <div className="flex items-center justify-between font-heading text-base font-bold">
                    <span>直播间列表</span>
                    <RoomCreate />
                </div>
                <DataTable columns={columns} paginateData={data} />
            </div>
        </ConsoleLayout>
    );
}
