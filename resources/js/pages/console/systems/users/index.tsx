import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/winglab/layout';
import { AdminLayout } from '@/layouts/admin-layout';
import { User } from '@/services/model';
import { Link } from '@inertiajs/react';
import { DataTable, defineColumns, type PaginateData } from '@winglab/inertia-table';
import { UserCreate } from './partial/forms';

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
                    {data.role === 'admin' && '管理员'}
                    {data.role === 'director' && '导播'}
                </>
            ),
            filter: [
                { label: '管理', value: 'admin' },
                { label: '导播', value: 'director' },
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
                <DataTable columns={columns} paginateData={data} />
            </PageContainer>
        </AdminLayout>
    );
}
