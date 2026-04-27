import { PageContainer } from '@/components/container';
import { Button } from '@/components/ui/button';
import { AdminLayout } from '@/layouts/admin-layout';
import { User } from '@/services/model';
import { Link } from '@inertiajs/react';
import { ColumnsDef, type PaginateData, RouterTable } from '@winglab/inertia-table';
import { UserCreate } from './partial/forms';

export default function Users({ data }: { data: PaginateData<User> }) {
    const columns = ColumnsDef<User>([
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
                    {data.role === 'room-admin' && '直播管理员'}
                </>
            ),
            filters: [
                { label: '系统管理', value: 'admin' },
                { label: '直播管理', value: 'room-admin' },
            ],
        },
        {
            index: 'actions',
            tableRowRender: (data) => {
                return (
                    <Button asChild variant="secondary">
                        <Link href={route('systems.users.show', data.id)}>详情</Link>
                    </Button>
                );
            },
        },
    ]);

    return (
        <AdminLayout>
            <PageContainer title="管理员" actions={[<UserCreate key="create" />]}>
                <RouterTable columns={columns} data={data} />
            </PageContainer>
        </AdminLayout>
    );
}
