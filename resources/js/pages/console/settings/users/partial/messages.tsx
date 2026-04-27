import { Section } from '@/components/container';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDatetime } from '@/lib/utils';
import { LiveMessage } from '@/services/model';
import { ColumnsDef, Table } from '@winglab/inertia-table';

export function MessageIndex({ messages }: { messages: LiveMessage[] }) {
  const messagesColumns = ColumnsDef<LiveMessage>([
    {
      title: '直播间',
      dataKey: ['room', 'name'],
    },
    {
      title: '场次名称',
      dataKey: ['event', 'name'],
    },
    {
      title: '评论内容',
      dataKey: 'content',
      tableRowRender: (data) => (
        <Tooltip>
          <TooltipTrigger className="block max-w-48 overflow-hidden text-ellipsis whitespace-nowrap">
            {data.content}
          </TooltipTrigger>
          <TooltipContent>{data.content}</TooltipContent>
        </Tooltip>
      ),
    },
    {
      title: '评论时间',
      dataKey: 'created_at',
      tableRowRender: (data) => formatDatetime(data.created_at),
    },
    {
      title: '审核时间',
      dataKey: 'reviewed_at',
      tableRowRender: (data) => formatDatetime(data?.reviewed_at),
    },
  ]);

  return (
    <Section title="评论记录">
      <Table data={messages} columns={messagesColumns} />
    </Section>
  );
}
