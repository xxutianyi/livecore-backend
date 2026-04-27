import { AreaContents, buildConfig, Config, LineGradients } from '@/components/chart';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { formatDatetime } from '@/lib/utils';
import { LiveEventStat } from '@/services/model';
import { AreaChart, CartesianGrid, XAxis } from 'recharts';

export function VisitChart({ data }: { data: LiveEventStat[] }) {
  const configs: Config[] = [
    { label: '在线用户', dataKey: 'users_count' },
    { label: '评论总数', dataKey: 'messages_count' },
    { label: '审核通过评论数', dataKey: 'messages_reviewed_count' },
  ];

  return (
    <ChartContainer config={buildConfig(configs)} className="aspect-auto h-50 w-full">
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
  );
}
