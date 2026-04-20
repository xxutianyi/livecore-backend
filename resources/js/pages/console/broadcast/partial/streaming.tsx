import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { LivePlayer } from '@/components/watch/player';
import FloatingWindow from '@/components/window';
import { Description, DescriptionItem } from '@/components/winglab/description';
import { Section } from '@/components/winglab/layout';
import { formatDatetime } from '@/lib/utils';
import { LiveEvent, LiveMessage } from '@/services/model';
import { defineColumns, SimpleTable } from '@winglab/inertia-table';

export function StreamingPlay({ event }: { event: LiveEvent }) {
    return (
        <FloatingWindow title="直播监看">
            <LivePlayer src={event.pull_url} />
        </FloatingWindow>
    );
}

export function StreamingMessage() {
    const columns = defineColumns<LiveMessage>([
        {
            title: '发送人',
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
        <Section title="评论审核">
            <SimpleTable data={[]} columns={columns} />
        </Section>
    );
}

export function StreamingConfig({ event }: { event: LiveEvent }) {
    console.log(event);

    return (
        <Section title="推流参数">
            <Description>
                <DescriptionItem label="推流链接" className="col-span-4">
                    {event.push_url}
                </DescriptionItem>
                <DescriptionItem label="播放链接" className="col-span-4">
                    {event.pull_url}
                </DescriptionItem>
            </Description>
        </Section>
    );
}
