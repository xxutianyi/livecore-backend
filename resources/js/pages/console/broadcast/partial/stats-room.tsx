import { AreaContents, buildConfig, Config, LineGradients } from '@/components/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { formatDatetime } from '@/lib/utils';
import { StatsRangeRoom } from '@/pages/console/broadcast/partial/stats-range';
import { LiveRoomStat } from '@/services/model';
import { AreaChart, CartesianGrid, XAxis } from 'recharts';

export function StatsRoom({ data }: { data: LiveRoomStat[] }) {
    const configs: Config[] = [
        { label: '在线用户', dataKey: 'users_count' },
        { label: '评论总数', dataKey: 'messages_count' },
        { label: '审核通过评论数', dataKey: 'messages_reviewed_count' },
    ];

    return (
        <Card className="pt-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>直播间数据</CardTitle>
                    <CardDescription>直播间下全部场次用户观看和评论统计</CardDescription>
                </div>
                <StatsRangeRoom />
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
