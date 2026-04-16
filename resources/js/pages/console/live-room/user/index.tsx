import { DataTable, defineColumns } from '@/components/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConsoleLayout } from '@/layouts/console-layout';
import { formatDatetime } from '@/lib/utils';
import { User } from '@/services/model';
import { PaginateData } from '@/types';
import { Link } from '@inertiajs/react';
import { UserCreate } from './partial/user';

export default function Users({ data }: { data: PaginateData<User> }) {
    const columns = defineColumns<User>([
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
            tableRowRender: (data) => (
                <Badge variant={data.online ? 'default' : 'secondary'}>{data.online ? '在线' : '离线'}</Badge>
            ),
            filter: [
                { label: '在线', value: 'true' },
                { label: '离线', value: 'false' },
            ],
        },
        {
            dataKey: 'leaving_at',
            title: '上次在线时间',
            tableRowRender: (data) => formatDatetime(data.leaving_at),
        },
        {
            index: 'actions',
            tableRowRender: (data) => {
                return (
                    <Button asChild variant="secondary">
                        <Link href={route('users.show', data.id)}>详情</Link>
                    </Button>
                );
            },
        },
    ]);

    return (
        <ConsoleLayout className="p-4">
            <div className="w-full space-y-4">
                <div className="flex items-center justify-between font-heading text-base font-bold">
                    <span>观众列表</span>
                    <UserCreate />
                </div>
                <DataTable columns={columns} paginateData={data} toolbarAction={<></>} />
            </div>
        </ConsoleLayout>
    );
}
