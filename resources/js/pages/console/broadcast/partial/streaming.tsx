import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { LivePlayer } from '@/components/watch/player';
import { Section } from '@/components/winglab/layout';
import { formatDatetime } from '@/lib/utils';
import { LiveMessage } from '@/services/model';
import { defineColumns, SimpleTable } from '@winglab/inertia-table';

export function StreamingPlay() {
    return (
        <Section title="直播监看">
            <LivePlayer
                src={
                    'https://1500009007.vod2.myqcloud.com/6c9c6038vodcq1500009007/2fb02795387702305297108918/w3C7ZwlsPNYA.mp4'
                }
            />
        </Section>
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

export function StreamingConfig() {
    return <Section title="推流参数"></Section>;
}
