import { DataTable, defineColumns } from '@/components/table';
import { Button } from '@/components/ui/button';
import { ConsoleLayout } from '@/layouts/console-layout';
import { User } from '@/services/model';
import { PaginateData } from '@/types';
import { Link } from '@inertiajs/react';

export const columns = defineColumns<User>([
    {
        dataKey: 'name',
        title: '名字',
        sortable: true,
    },
    {
        dataKey: 'phone',
        title: '手机号',
        sortable: true,
    },
    {
        dataKey: 'email',
        title: '电子邮箱',
        sortable: true,
    },
    {
        dataKey: 'online',
        title: '在线状态',
    },
    {
        dataKey: 'online_at',
        title: '上次在线时间',
    },
    {
        index: 'actions',
        tableRowRender: (data) => {
            return (
                <Button asChild variant="secondary">
                    <Link href={`/console/live-room/users/${data.id}`}>详情</Link>
                </Button>
            );
        },
    },
]);

export default function Users({ data }: { data: PaginateData<User> }) {
    return (
        <ConsoleLayout className="p-4">
            <DataTable
                columns={columns}
                paginateData={data}
                onRowSelection={(value) => {
                    console.log(value);
                }}
            />
        </ConsoleLayout>
    );
}
