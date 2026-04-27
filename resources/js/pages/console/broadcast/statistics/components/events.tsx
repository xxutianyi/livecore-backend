import { Section } from '@/components/container';
import { Button } from '@/components/ui/button';
import { formatDatetime } from '@/lib/utils';
import { LiveEvent } from '@/services/model';
import { Link } from '@inertiajs/react';
import { ColumnsDef, Table } from '@winglab/inertia-table';

export function EventIndex({ data }: { data: LiveEvent[] }) {
  const columns = ColumnsDef<LiveEvent>([
    {
      title: '场次名称',
      dataKey: 'name',
    },
    {
      title: '开始直播',
      dataKey: 'started_at',
      tableRowRender: (data) => formatDatetime(data.started_at),
    },
    {
      title: '结束直播',
      dataKey: 'finished_at',
      tableRowRender: (data) => formatDatetime(data.finished_at),
    },
    {
      index: 'actions',
      tableRowRender: (data) => {
        return (
          <Button asChild>
            <Link href={route('broadcast.statistics.show', [data.room_id, data.id])}>查看数据</Link>
          </Button>
        );
      },
    },
  ]);

  return (
    <Section title="历史场次">
      <Table columns={columns} data={data} />
    </Section>
  );
}
