import { PageContainer } from '@/components/container';
import { Button } from '@/components/ui/button';
import { ConsoleLayout } from '@/layouts/console-layout';
import { User } from '@/services/model';
import { Link } from '@inertiajs/react';
import { ColumnsDef, type PaginateData, RouterTable } from '@winglab/inertia-table';
import { ServiceAccountCreate } from './partial/forms';

export default function ServiceAccounts({ data }: { data: PaginateData<User> }) {
  const columns = ColumnsDef<User>([
    {
      dataKey: 'name',
      title: '名称',
      sortable: true,
    },
    {
      dataKey: 'manageable',
      title: '授权直播间',
      tableRowRender: (data) => `${data.manageable?.length ?? 0} 个`,
    },
    {
      index: 'actions',
      tableRowRender: (data) => (
        <Button asChild variant="secondary">
          <Link href={route('systems.service-accounts.show', data.id)}>详情</Link>
        </Button>
      ),
    },
  ]);

  return (
    <ConsoleLayout>
      <PageContainer
        title="影子用户"
        breadcrumb={[{ label: '影子用户', link: route('systems.service-accounts.index') }]}
        actions={[<ServiceAccountCreate key="create" />]}
      >
        <RouterTable columns={columns} data={data} />
      </PageContainer>
    </ConsoleLayout>
  );
}
