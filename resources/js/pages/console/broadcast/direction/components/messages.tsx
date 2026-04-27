import { Section } from '@/components/container';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDatetime } from '@/lib/utils';
import { LiveMessage } from '@/services/model';
import { router } from '@inertiajs/react';
import { ColumnsDef, Table } from '@winglab/inertia-table';

export function MessageReview({ messages }: { messages: LiveMessage[] }) {
  function handleReview(message: LiveMessage) {
    router.put(route('broadcast.message.review', [message.room_id, message.id]));
  }

  const columns = ColumnsDef<LiveMessage>([
    {
      title: '发送人',
      dataKey: ['sender', 'name'],
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
    {
      index: 'actions',
      tableRowRender: (data) => {
        return (
          <Button
            disabled={!!data.reviewed_at}
            onClick={() => handleReview(data)}
            variant={!data.reviewed_at ? 'destructive' : 'secondary'}
          >
            {data.reviewed_at ? '已审核' : '通过'}
          </Button>
        );
      },
    },
  ]);

  return (
    <Section title="评论审核">
      <Table data={messages} columns={columns} />
    </Section>
  );
}
