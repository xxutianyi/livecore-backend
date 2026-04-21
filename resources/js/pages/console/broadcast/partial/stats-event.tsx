import { AreaContents, buildConfig, Config, LineGradients } from '@/components/chart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { Section } from '@/components/winglab/layout';
import { formatDatetime } from '@/lib/utils';
import { StatsRangeEvent } from '@/pages/console/broadcast/partial/stats-range';
import { LiveEvent, LiveEventStat } from '@/services/model';
import { Link } from '@inertiajs/react';
import { defineColumns, SimpleTable } from '@winglab/inertia-table';
import { AreaChart, CartesianGrid, XAxis } from 'recharts';

export function EventIndex({ data }: { data: LiveEvent[] }) {
    const columns = defineColumns<LiveEvent>([
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
                        <Link href={route('broadcast.statistics', [data.room_id, data.id])}>查看数据</Link>
                    </Button>
                );
            },
        },
    ]);

    return (
        <Section title="历史场次">
            <SimpleTable columns={columns} data={data} />
        </Section>
    );
}

export function StatsEvent({ data }: { data: LiveEventStat[] }) {
    const configs: Config[] = [
        { label: '在线用户', dataKey: 'users_count' },
        { label: '评论总数', dataKey: 'messages_count' },
        { label: '审核通过评论数', dataKey: 'messages_reviewed_count' },
    ];

    return (
        <Card className="pt-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>直播场次数据</CardTitle>
                    <CardDescription>该场次用户观看和评论统计</CardDescription>
                </div>
                <StatsRangeEvent />
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer config={buildConfig(configs)} className="aspect-auto h-[200px] w-full">
                    <AreaChart data={data}>
                        <LineGradients configs={configs} />
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="created_at"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                return formatDatetime(value);
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return formatDatetime(value);
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <AreaContents configs={configs} />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
