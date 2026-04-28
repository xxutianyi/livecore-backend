import { PageContainer } from '@/components/container';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ConsoleLayout } from '@/layouts/console-layout';
import { formatDatetime } from '@/lib/utils';
import { ClientCreate, ClientDelete } from '@/pages/console/systems/clients/forms';
import { Client } from '@/services/model';
import { usePage } from '@inertiajs/react';
import { ColumnsDef, PaginateData, RouterTable } from '@winglab/inertia-table';
import { CheckCircle2Icon } from 'lucide-react';

export default function Clients({ data }: { data: PaginateData<Client> }) {
  const { flash } = usePage();

  const columns = ColumnsDef<Client>([
    {
      dataKey: 'name',
      title: '凭证名称',
    },
    {
      dataKey: 'whitelist',
      title: 'IP白名单',
      tableRowRender: (data) => {
        return (
          <div className="space-x-2">
            {data.whitelist?.map((value) => (
              <Badge variant="destructive">{value}</Badge>
            ))}
          </div>
        );
      },
    },
    {
      dataKey: 'created_at',
      title: '创建时间',
      tableRowRender: (data) => formatDatetime(data.created_at),
    },
    {
      index: 'actions',
      tableRowRender: (data) => {
        return <ClientDelete client={data} />;
      },
    },
  ]);

  return (
    <ConsoleLayout>
      <PageContainer
        title="接口访问"
        breadcrumb={[{ label: '接口访问', link: route('systems.clients.index') }]}
        actions={[<ClientCreate key="create" />]}
      >
        {flash.id && flash.secret ? (
          <>
            <Alert>
              <CheckCircle2Icon />
              <AlertTitle>凭证创建成功</AlertTitle>
              <AlertDescription className="space-y-2">
                <div>请保存以下信息，离开页面后将无法再次查询：</div>
                <div className="flex flex-col space-y-2 font-mono text-destructive">
                  <div>Client ID: {flash.id as string}</div>
                  <div>Client Secret: {flash.secret as string}</div>
                </div>
              </AlertDescription>
            </Alert>
            <Separator />
          </>
        ) : null}
        <RouterTable columns={columns} data={data} />
      </PageContainer>
    </ConsoleLayout>
  );
}
