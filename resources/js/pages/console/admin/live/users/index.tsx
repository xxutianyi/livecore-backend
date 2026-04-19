import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/winglab/layout';
import { AdminLayout } from '@/layouts/admin-layout';
import { formatDatetime } from '@/lib/utils';
import { User } from '@/services/model';
import { Link } from '@inertiajs/react';
import { DataTable, defineColumns, type PaginateData } from '@winglab/inertia-table';
import { useState } from 'react';
import { UserBatchGroup, UserCreate } from './partial/user-forms';
import { GroupIndex } from './partial/user-group';

export default function Users({ data }: { data: PaginateData<User> }) {
    const [select, setSelect] = useState<string[]>();

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
            index: 'groups',
            title: '分组',
            tableRowRender: (data) => (
                <>
                    {data.groups?.map((group, index) => (
                        <span key={index}>
                            {group.name}
                            {index + 1 !== data.groups?.length && <>&nbsp;,&nbsp;</>}
                        </span>
                    ))}
                </>
            ),
        },
        {
            index: 'actions',
            tableRowRender: (data) => {
                return (
                    <Button asChild variant="secondary">
                        <Link href={route('admin.live.users.show', data.id)}>详情</Link>
                    </Button>
                );
            },
        },
    ]);

    const actions =
        select && select?.length > 0
            ? [<UserBatchGroup ids={select} key="batch" />, <UserCreate key="create" />, <GroupIndex key="group" />]
            : [<UserCreate key="create" />, <GroupIndex key="group" />];

    return (
        <AdminLayout>
            <PageContainer title="观众列表" actions={actions}>
                <DataTable columns={columns} paginateData={data} onRowSelection={setSelect} />
            </PageContainer>
        </AdminLayout>
    );
}
