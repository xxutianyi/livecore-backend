import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/winglab/layout';
import { AdminLayout } from '@/layouts/admin-layout';
import { User } from '@/services/model';
import { Link } from '@inertiajs/react';
import { DataTable, defineColumns, type PaginateData } from '@winglab/inertia-table';
import { UserCreate } from './partial/user-forms';

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
            dataKey: 'role',
            title: '用户角色',
            tableRowRender: (data) => (
                <>
                    {data.role === 'admin' && '系统管理员'}
                    {data.role === 'director' && '直播间导播'}
                </>
            ),
            filter: [
                { label: '系统管理员', value: 'admin' },
                { label: '直播间导播', value: 'director' },
            ],
        },
        {
            index: 'actions',
            tableRowRender: (data) => {
                return (
                    <Button asChild variant="secondary">
                        <Link href={route('admin.settings.users.show', data.id)}>详情</Link>
                    </Button>
                );
            },
        },
    ]);

    return (
        <AdminLayout>
            <SectionHeader title="管理员列表" />
            <DataTable columns={columns} paginateData={data} toolbarAction={<UserCreate />} />
        </AdminLayout>
    );
}
