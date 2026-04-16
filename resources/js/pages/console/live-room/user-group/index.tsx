import { DataTable, defineColumns } from '@/components/table';
import { ConsoleLayout } from '@/layouts/console-layout';
import { UserGroup } from '@/services/model';
import { PaginateData } from '@/types';
import { GroupCreate, GroupUpdate } from './partial/group';

export default function Users({ data }: { data: PaginateData<UserGroup> }) {
    const columns = defineColumns<UserGroup>([
        {
            dataKey: 'name',
            title: '名字',
            sortable: true,
        },
        {
            dataKey: 'users_count',
            title: '成员数量',
            sortable: true,
        },
        {
            index: 'actions',
            tableRowRender: (data) => {
                return <GroupUpdate group={data} />;
            },
        },
    ]);

    return (
        <ConsoleLayout className="p-4">
            <div className="w-full space-y-4">
                <div className="flex items-center justify-between font-heading text-base font-bold">
                    <span>观众分组</span>
                    <GroupCreate />
                </div>
                <DataTable columns={columns} paginateData={data} />
            </div>
        </ConsoleLayout>
    );
}
